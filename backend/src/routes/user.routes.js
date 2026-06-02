// src/routes/user.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/profile', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      addresses: true,
      _count: { select: { orders: true, wishlistItems: true } },
    },
  });
  res.json({ success: true, data: { user } });
}));

router.patch('/profile', asyncHandler(async (req, res) => {
  const { firstName, lastName, email, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { firstName, lastName, email, avatar },
  });
  res.json({ success: true, data: { user } });
}));

// Addresses
router.get('/addresses', asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({ where: { userId: req.user.userId } });
  res.json({ success: true, data: { addresses } });
}));

router.post('/addresses', asyncHandler(async (req, res) => {
  const { isDefault, ...data } = req.body;
  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user.userId }, data: { isDefault: false } });
  }
  const address = await prisma.address.create({ data: { ...data, userId: req.user.userId, isDefault: isDefault || false } });
  res.status(201).json({ success: true, data: { address } });
}));

router.put('/addresses/:id', asyncHandler(async (req, res) => {
  const { isDefault, ...data } = req.body;
  if (isDefault) {
    await prisma.address.updateMany({ where: { userId: req.user.userId }, data: { isDefault: false } });
  }
  const address = await prisma.address.update({ where: { id: req.params.id }, data: { ...data, isDefault: isDefault || false } });
  res.json({ success: true, data: { address } });
}));

router.delete('/addresses/:id', asyncHandler(async (req, res) => {
  await prisma.address.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Address deleted.' });
}));

// Recently Viewed
router.get('/recently-viewed', asyncHandler(async (req, res) => {
  const items = await prisma.recentlyViewed.findMany({
    where: { userId: req.user.userId },
    include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    orderBy: { viewedAt: 'desc' },
    take: 20,
  });
  res.json({ success: true, data: { items: items.map((i) => i.product) } });
}));

// Loyalty
router.get('/loyalty', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { loyaltyPoints: true } });
  const logs = await prisma.loyaltyLog.findMany({ where: { userId: req.user.userId }, orderBy: { createdAt: 'desc' }, take: 20 });
  res.json({ success: true, data: { points: user.loyaltyPoints, logs } });
}));

export default router;
