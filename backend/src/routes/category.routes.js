// src/routes/category.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import slugify from 'slugify';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import AppError from '../utils/AppError.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    include: { children: { where: { isActive: true } }, _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { sortOrder: 'asc' },
  });
  res.json({ success: true, data: { categories } });
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const cat = await prisma.category.findFirst({ where: { slug: req.params.slug, isActive: true }, include: { children: true } });
  if (!cat) throw new AppError('Category not found.', 404);
  res.json({ success: true, data: { category: cat } });
}));

router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { name, description, image, parentId, sortOrder, metaTitle, metaDesc } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  // Check if category with this slug already exists
  const existing = await prisma.category.findFirst({ where: { slug, isActive: true } });
  if (existing) throw new AppError('Category with this name already exists.', 400);

  // Handle empty parentId
  const categoryParentId = parentId === '' ? null : parentId;

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      image,
      parentId: categoryParentId,
      sortOrder: parseInt(sortOrder) || 0,
      metaTitle,
      metaDesc
    }
  });
  res.status(201).json({ success: true, data: { category } });
}));

router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });

  // Handle empty parentId
  if (data.parentId === '') data.parentId = null;

  const category = await prisma.category.update({ where: { id: req.params.id }, data });
  res.json({ success: true, data: { category } });
}));

router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.category.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true, message: 'Category deleted.' });
}));

export default router;
