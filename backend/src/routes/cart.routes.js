// src/routes/cart.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.userId },
    include: {
      product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      variant: true,
    },
  });
  const total = items.reduce((sum, i) => sum + parseFloat(i.variant?.price || i.product.basePrice) * i.quantity, 0);
  res.json({ success: true, data: { items, total, count: items.length } });
}));

router.post('/add', asyncHandler(async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product?.isActive) throw new AppError('Product not available.', 400);

  // Try to find existing cart item
  const existingItem = await prisma.cartItem.findFirst({
    where: { 
      userId: req.user.userId, 
      productId, 
      variantId: variantId || null 
    },
  });

  let item;
  if (existingItem) {
    // Update existing item
    item = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } }, variant: true },
    });
  } else {
    // Create new item
    item = await prisma.cartItem.create({
      data: { 
        userId: req.user.userId, 
        productId, 
        variantId: variantId || null, 
        quantity 
      },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } }, variant: true },
    });
  }

  res.json({ success: true, message: 'Item added to cart.', data: { item } });
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    await prisma.cartItem.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: 'Item removed.' });
  }
  const item = await prisma.cartItem.update({ where: { id: req.params.id }, data: { quantity } });
  res.json({ success: true, data: { item } });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Item removed.' });
}));

router.delete('/', asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.userId } });
  res.json({ success: true, message: 'Cart cleared.' });
}));

export default router;
