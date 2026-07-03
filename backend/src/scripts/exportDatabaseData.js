import 'dotenv/config';
import prisma from '../utils/db.js';
import fs from 'fs';
import path from 'path';

async function exportDatabaseData() {
  console.log('Exporting database data for GitHub deployment...\n');

  // Export all products with their images
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      brand: true,
      images: true,
    },
  });

  console.log(`Found ${products.length} products`);

  // Export categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
  });

  console.log(`Found ${categories.length} categories`);

  // Export brands
  const brands = await prisma.brand.findMany();

  console.log(`Found ${brands.length} brands`);

  // Create seed data object
  const seedData = {
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      basePrice: p.basePrice,
      comparePrice: p.comparePrice,
      discount: p.discount,
      sku: p.sku,
      categoryId: p.categoryId,
      brandId: p.brandId,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
      isLimitedEdition: p.isLimitedEdition,
      isActive: p.isActive,
      primaryImage: p.primaryImage,
      images: p.images.map(img => ({
        url: img.url,
        altText: img.altText,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
      })),
      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
      },
    })),
    categories: categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      parentId: c.parentId,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
    })),
    brands: brands.map(b => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description,
      logo: b.logo,
      isActive: b.isActive,
    })),
  };

  // Save to JSON file
  const outputPath = path.join(process.cwd(), 'src/scripts/seedData.json');
  fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));

  console.log(`\n✅ Database data exported to: ${outputPath}`);
  console.log(`   - ${products.length} products`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${brands.length} brands`);

  await prisma.$disconnect();
}

exportDatabaseData().catch(async (error) => {
  console.error('Error:', error);
  await prisma.$disconnect();
  process.exit(1);
});