// src/routes/coupon.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/validate', authenticate, asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.isActive) throw new AppError('Invalid or expired coupon.', 400);
  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) throw new AppError('Coupon not yet active.', 400);
  if (coupon.expiresAt && coupon.expiresAt < now) throw new AppError('Coupon has expired.', 400);
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new AppError('Coupon usage limit reached.', 400);
  if (coupon.minOrderAmount && subtotal < parseFloat(coupon.minOrderAmount)) {
    throw new AppError(`Minimum order of ₦${parseFloat(coupon.minOrderAmount).toLocaleString()} required.`, 400);
  }
  let discount = 0;
  if (coupon.type === 'PERCENTAGE') discount = (subtotal * parseFloat(coupon.value)) / 100;
  else if (coupon.type === 'FIXED_AMOUNT') discount = parseFloat(coupon.value);
  res.json({ success: true, data: { coupon, discount: Math.min(discount, subtotal) } });
}));

router.get('/admin', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: { coupons } });
}));

router.post('/admin', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.create({ data: { ...req.body, code: req.body.code.toUpperCase(), value: parseFloat(req.body.value) } });
  res.status(201).json({ success: true, data: { coupon } });
}));

router.put('/admin/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: { coupon } });
}));

router.delete('/admin/:id', authenticate, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.coupon.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ success: true, message: 'Coupon deactivated.' });
}));

export default router;
