// src/routes/review.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/product/:productId', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'recent' } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const orderBy = sort === 'helpful' ? { helpfulCount: 'desc' } : { createdAt: 'desc' };
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId: req.params.productId, status: 'APPROVED' },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy, skip, take: parseInt(limit),
    }),
    prisma.review.count({ where: { productId: req.params.productId, status: 'APPROVED' } }),
  ]);
  res.json({ success: true, data: { reviews, total, totalPages: Math.ceil(total / parseInt(limit)) } });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { productId, rating, title, body, images } = req.body;
  const existing = await prisma.review.findUnique({ where: { productId_userId: { productId, userId: req.user.userId } } });
  if (existing) throw new AppError('You have already reviewed this product.', 400);
  const review = await prisma.review.create({
    data: { productId, userId: req.user.userId, rating: parseInt(rating), title, body, images: images ? JSON.stringify(images) : null },
  });
  res.status(201).json({ success: true, message: 'Review submitted for approval.', data: { review } });
}));

router.patch('/admin/:id/status', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const { status } = req.body;
  await prisma.review.update({ where: { id: req.params.id }, data: { status } });
  res.json({ success: true, message: 'Review status updated.' });
}));

export default router;
