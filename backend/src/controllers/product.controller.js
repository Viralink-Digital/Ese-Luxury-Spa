// src/controllers/product.controller.js
import prisma from '../utils/db.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
// Redis removed; caching disabled
import slugify from 'slugify';

const CACHE_TTL = 300; // 5 minutes

// ─────────────────────────────────────────
// LIST PRODUCTS (with full filters)
// ─────────────────────────────────────────
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    featured,
    bestSeller,
    newArrival,
    limitedEdition,
    rating,
    tags,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build where clause
  const where = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { some: { tag: { contains: search } } } },
    ];
  }
  if (category) {
    // Support both slug and id
    const cat = await prisma.category.findFirst({
      where: { OR: [{ slug: category }, { id: category }] },
    });
    if (cat) {
      // Include subcategories
      const allCats = await prisma.category.findMany({
        where: { OR: [{ id: cat.id }, { parentId: cat.id }] },
      });
      where.categoryId = { in: allCats.map((c) => c.id) };
    }
  }
  if (brand) where.brandId = brand;
  if (minPrice || maxPrice) {
    where.basePrice = {};
    if (minPrice) where.basePrice.gte = parseFloat(minPrice);
    if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
  }
  if (featured === 'true') where.isFeatured = true;
  if (bestSeller === 'true') where.isBestSeller = true;
  if (newArrival === 'true') where.isNewArrival = true;
  if (limitedEdition === 'true') where.isLimitedEdition = true;
  if (rating) where.avgRating = { gte: parseFloat(rating) };
  if (tags) {
    const tagList = tags.split(',');
    where.tags = { some: { tag: { in: tagList } } };
  }

  // Sort mapping
  const sortMap = {
    price_asc: { basePrice: 'asc' },
    price_desc: { basePrice: 'desc' },
    rating: { avgRating: 'desc' },
    popular: { totalSold: 'desc' },
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
  };
  const orderBy = sortMap[sort] || { [sort]: order };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit),
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, logo: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      products: products.map(formatProduct),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1,
      },
    },
  });
});

// ─────────────────────────────────────────
// GET SINGLE PRODUCT
// ─────────────────────────────────────────
export const getProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Caching disabled; always fetch fresh product

  const product = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }], isActive: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      category: true,
      brand: true,
      tags: true,
      reviews: {
        where: { status: 'APPROVED' },
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) throw new AppError('Product not found.', 404);

  const formatted = {
    ...formatProduct(product),
    images: product.images,
    variants: product.variants,
    reviews: product.reviews,
    ingredients: product.ingredients,
    benefits: product.benefits,
    usageInstructions: product.usageInstructions,
  };

  // No cache set (Redis removed)

  // Track recently viewed
  if (req.user) {
    prisma.recentlyViewed.upsert({
      where: { userId_productId: { userId: req.user.userId, productId: product.id } },
      update: { viewedAt: new Date() },
      create: { userId: req.user.userId, productId: product.id },
    }).catch(() => {});
  }

  res.json({ success: true, data: { product: formatted } });
});

// ─────────────────────────────────────────
// GET RELATED PRODUCTS
// ─────────────────────────────────────────
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found.', 404);

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId },
      isActive: true,
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      brand: { select: { name: true } },
    },
    take: 8,
    orderBy: { totalSold: 'desc' },
  });

  res.json({ success: true, data: { products: related.map(formatProduct) } });
});

// ─────────────────────────────────────────
// ADMIN: CREATE PRODUCT
// ─────────────────────────────────────────
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, ingredients, benefits, usageInstructions,
    basePrice, comparePrice, sku, barcode, weight,
    categoryId, brandId,
    isFeatured, isBestSeller, isNewArrival, isLimitedEdition,
    metaTitle, metaDesc, metaKeywords,
    images, variants, tags,
  } = req.body;

  let slug = slugify(name, { lower: true, strict: true });

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    const suffix = Math.random().toString(36).slice(2, 8);
    slug = `${slug}-${suffix}`;
  }

  // Handle empty brandId
  const productBrandId = brandId === '' ? null : brandId;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      ingredients,
      benefits,
      usageInstructions,
      basePrice: basePrice !== undefined ? parseFloat(basePrice) : 0,
      comparePrice: comparePrice !== undefined ? parseFloat(comparePrice) : null,
      sku,
      barcode,
      weight: weight ? parseFloat(weight) : null,
      categoryId,
      brandId: productBrandId,
      isFeatured: isFeatured || false,
      isBestSeller: isBestSeller || false,
      isNewArrival: isNewArrival !== false,
      isLimitedEdition: isLimitedEdition || false,
      metaTitle: metaTitle || name,
      metaDesc,
      metaKeywords,
      publishedAt: new Date(),
      images: images?.length ? {
        create: images.map((img, i) => ({
          url: img.url,
          altText: img.altText || name,
          sortOrder: i,
          isPrimary: i === 0,
        })),
      } : undefined,
      variants: variants?.length ? {
        create: variants.map((v, i) => ({
          name: v.name,
          value: v.value,
          type: v.type,
          price: v.price !== undefined ? parseFloat(v.price) : null,
          stockQty: parseInt(v.stockQty) || 0,
          sku: v.sku,
          image: v.image,
          sortOrder: i,
        })),
      } : undefined,
      tags: tags?.length ? {
        create: tags.map((tag) => ({ tag })),
      } : undefined,
    },
    include: {
      images: true,
      variants: true,
      tags: true,
      category: true,
      brand: true,
    },
  });

  // Invalidate cache
  // No cache invalidation required

  res.status(201).json({ success: true, message: 'Product created.', data: { product } });
});

// ─────────────────────────────────────────
// ADMIN: UPDATE PRODUCT
// ─────────────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Product not found.', 404);

  const { images, variants, tags, ...updateData } = req.body;
  if (updateData.basePrice !== undefined) updateData.basePrice = parseFloat(updateData.basePrice);
  if (updateData.comparePrice !== undefined) updateData.comparePrice = parseFloat(updateData.comparePrice);
  if (updateData.weight !== undefined) {
    updateData.weight = updateData.weight === '' ? null : parseFloat(updateData.weight);
  }
  if (updateData.brandId === '') {
    updateData.brandId = null;
  }
  if (updateData.name && updateData.name !== existing.name) {
    updateData.slug = slugify(updateData.name, { lower: true, strict: true });
  }

  const nestedData = {};
  // Only update images if they are explicitly provided (not undefined)
  // If images is undefined, we keep the existing images
  if (images !== undefined && images !== null) {
    // If images array is provided, replace all images
    if (images.length > 0) {
      nestedData.images = {
        deleteMany: {},
        create: images.map((img, i) => ({
          url: img.url,
          altText: img.altText || updateData.name || existing.name,
          sortOrder: i,
          isPrimary: i === 0,
        })),
      };
    } else {
      // If empty array is provided, delete all images
      nestedData.images = {
        deleteMany: {},
      };
    }
  }

  // Only update variants if they are explicitly provided (not undefined)
  if (variants !== undefined && variants !== null) {
    if (variants.length > 0) {
      nestedData.variants = {
        deleteMany: {},
        create: variants.map((v, i) => ({
          name: v.name,
          value: v.value,
          type: v.type,
          price: v.price !== undefined ? parseFloat(v.price) : null,
          stockQty: parseInt(v.stockQty, 10) || 0,
          sku: v.sku,
          image: v.image,
          sortOrder: i,
        })),
      };
    } else {
      // If empty array is provided, delete all variants
      nestedData.variants = {
        deleteMany: {},
      };
    }
  }

  // Only update tags if they are explicitly provided (not undefined)
  if (tags !== undefined && tags !== null) {
    if (tags.length > 0) {
      nestedData.tags = {
        deleteMany: {},
        create: tags.map((tag) => ({ tag })),
      };
    } else {
      // If empty array is provided, delete all tags
      nestedData.tags = {
        deleteMany: {},
      };
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: { ...updateData, ...nestedData },
    include: { images: true, variants: true, category: true, brand: true },
  });

  // No cache invalidation required

  res.json({ success: true, message: 'Product updated.', data: { product } });
});

// ─────────────────────────────────────────
// ADMIN: DELETE PRODUCT
// ─────────────────────────────────────────
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found.', 404);

  // Hard delete with cascade - remove related records first
  await prisma.cartItem.deleteMany({ where: { productId: id } });
  await prisma.wishlistItem.deleteMany({ where: { productId: id } });
  await prisma.recentlyViewed.deleteMany({ where: { productId: id } });
  await prisma.review.deleteMany({ where: { productId: id } });
  await prisma.productTag.deleteMany({ where: { productId: id } });
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.orderItem.deleteMany({ where: { productId: id } });

  // Now delete the product
  await prisma.product.delete({ where: { id } });
  // No cache invalidation required

  res.json({ success: true, message: 'Product deleted.' });
});

// ─────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────
function formatProduct(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    basePrice: p.basePrice,
    comparePrice: p.comparePrice,
    discount: p.comparePrice
      ? Math.round(((p.comparePrice - p.basePrice) / p.comparePrice) * 100)
      : 0,
    sku: p.sku,
    categoryId: p.categoryId,
    brandId: p.brandId,
    category: p.category,
    brand: p.brand,
    isFeatured: p.isFeatured,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isLimitedEdition: p.isLimitedEdition,
    avgRating: p.avgRating,
    reviewCount: p.reviewCount || p._count?.reviews || 0,
    totalSold: p.totalSold,
    primaryImage: p.images?.[0]?.url || null,
    images: p.images,
    createdAt: p.createdAt,
  };
}
