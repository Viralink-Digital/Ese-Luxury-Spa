// src/routes/brand.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import slugify from 'slugify';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', asyncHandler(async (req, res) => {
  const brands = await prisma.brand.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
  res.json({ success: true, data: { brands } });
}));
router.post('/', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { name, logo, description, website } = req.body;
  const brand = await prisma.brand.create({ data: { name, slug: slugify(name, { lower: true, strict: true }), logo, description, website } });
  res.status(201).json({ success: true, data: { brand } });
}));
router.put('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const brand = await prisma.brand.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: { brand } });
}));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.brand.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true, message: 'Brand deleted.' });
}));
export default router;
