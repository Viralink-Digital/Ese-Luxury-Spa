// src/routes/wishlist.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user.userId },
    include: { product: { include: { images: { where: { isPrimary: true }, take: 1 }, brand: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: { items } });
}));

router.post('/toggle', asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: req.user.userId, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return res.json({ success: true, message: 'Removed from wishlist.', data: { wishlisted: false } });
  }
  await prisma.wishlistItem.create({ data: { userId: req.user.userId, productId } });
  res.json({ success: true, message: 'Added to wishlist.', data: { wishlisted: true } });
}));

export default router;
