// src/controllers/order.controller.js
import prisma from '../utils/db.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { initializePayment, verifyPayment } from '../services/korapay.service.js';
import { orderQueue } from '../jobs/queues.js';

// ─────────────────────────────────────────
// CHECKOUT: Initialize
// ─────────────────────────────────────────
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { addressId, couponCode, notes, paymentMethod } = req.body;

  // Get cart
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      variant: true,
    },
  });

  if (!cartItems.length) throw new AppError('Your cart is empty.', 400);

  // Validate stock
  for (const item of cartItems) {
    if (!item.product.isActive) {
      throw new AppError(`${item.product.name} is no longer available.`, 400);
    }
    if (item.variant && item.variant.stockQty < item.quantity) {
      throw new AppError(`Insufficient stock for ${item.product.name}.`, 400);
    }
  }

  // Calculate subtotal
  let subtotal = 0;
  const orderItems = cartItems.map((item) => {
    const price = parseFloat(item.variant?.price || item.product.basePrice);
    const total = price * item.quantity;
    subtotal += total;
    return {
      productId: item.product.id,
      variantId: item.variantId,
      name: item.product.name,
      image: item.product.images[0]?.url,
      price,
      quantity: item.quantity,
      total,
    };
  });

  // Apply coupon
  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });
    if (coupon && coupon.isActive) {
      const now = new Date();
      const valid =
        (!coupon.startsAt || coupon.startsAt <= now) &&
        (!coupon.expiresAt || coupon.expiresAt > now) &&
        (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
        (!coupon.minOrderAmount || subtotal >= parseFloat(coupon.minOrderAmount));

      if (valid) {
        if (coupon.type === 'PERCENTAGE') {
          discount = (subtotal * parseFloat(coupon.value)) / 100;
        } else if (coupon.type === 'FIXED_AMOUNT') {
          discount = parseFloat(coupon.value);
        }
        discount = Math.min(discount, subtotal);
      }
    }
  }

  // Shipping fee (free over ₦15,000)
  const shippingFee = subtotal - discount >= 15000 ? 0 : 1500;
  const total = subtotal - discount + shippingFee;

  // Generate order number
  const orderNumber = `ESE-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      addressId,
      subtotal,
      shippingFee,
      discount,
      total,
      couponId: coupon?.id,
      notes,
      paymentMethod,
      items: { create: orderItems },
      statusHistory: {
        create: { status: 'PENDING', note: 'Order placed', createdBy: userId },
      },
    },
    include: {
      items: true,
      address: true,
    },
  });

  // Update coupon usage
  if (coupon) {
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });
  }

  // Initialize Korapay payment
  const paymentData = await initializePayment({
    reference: order.orderNumber,
    amount: total,
    currency: 'NGN',
    customerName: req.user.firstName || 'Customer',
    customerEmail: req.user.email || `${req.user.phone}@ese.com`,
    customerPhone: req.user.phone,
    redirectUrl: `${process.env.FRONTEND_URL}/orders/${order.id}/confirmation`,
    metadata: { orderId: order.id, userId },
  });

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { userId } });

  res.status(201).json({
    success: true,
    message: 'Order created.',
    data: {
      order,
      payment: {
        checkoutUrl: paymentData.data?.checkout_url,
        reference: orderNumber,
      },
    },
  });
});

// ─────────────────────────────────────────
// VERIFY PAYMENT (after redirect)
// ─────────────────────────────────────────
export const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { reference } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderNumber: reference },
    include: { items: true, user: true },
  });

  if (!order) throw new AppError('Order not found.', 404);
  if (order.userId !== req.user.userId) throw new AppError('Unauthorized.', 403);

  const verification = await verifyPayment(reference);

  if (verification.data?.status === 'success') {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        paymentRef: verification.data.reference,
        status: 'CONFIRMED',
      },
    });

    await prisma.orderStatusHistory.create({
      data: { orderId: order.id, status: 'CONFIRMED', note: 'Payment confirmed' },
    });

    // Award loyalty points
    const points = Math.floor(parseFloat(order.total) * parseFloat(process.env.POINTS_PER_NAIRA));
    if (points > 0) {
      await prisma.user.update({
        where: { id: order.userId },
        data: { loyaltyPoints: { increment: points } },
      });
      await prisma.loyaltyLog.create({
        data: {
          userId: order.userId,
          points,
          type: 'earn',
          description: `Earned from order ${order.orderNumber}`,
          orderId: order.id,
        },
      });
    }

    // Queue notifications
    await orderQueue.add('order-confirmed', {
      orderId: order.id,
      userId: order.userId,
      phone: order.user.phone,
      orderNumber: order.orderNumber,
      total: order.total,
    });
  }

  res.json({
    success: true,
    data: {
      order: await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } }),
      paymentStatus: verification.data?.status,
    },
  });
});

// ─────────────────────────────────────────
// GET USER ORDERS
// ─────────────────────────────────────────
export const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { page = 1, limit = 10, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = { userId };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          take: 3,
          select: { name: true, image: true, quantity: true, price: true },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
    },
  });
});

// ─────────────────────────────────────────
// GET SINGLE ORDER
// ─────────────────────────────────────────
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!order) throw new AppError('Order not found.', 404);
  if (order.userId !== req.user.userId && req.user.role === 'CUSTOMER') {
    throw new AppError('Unauthorized.', 403);
  }

  res.json({ success: true, data: { order } });
});

// ─────────────────────────────────────────
// CANCEL ORDER
// ─────────────────────────────────────────
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError('Order not found.', 404);
  if (order.userId !== req.user.userId) throw new AppError('Unauthorized.', 403);
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage.', 400);
  }

  await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED', cancelReason: reason },
  });

  await prisma.orderStatusHistory.create({
    data: { orderId: id, status: 'CANCELLED', note: reason, createdBy: req.user.userId },
  });

  res.json({ success: true, message: 'Order cancelled.' });
});

// ─────────────────────────────────────────
// ADMIN: GET ALL ORDERS
// ─────────────────────────────────────────
export const adminGetOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search, from, to } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where = {};

  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { user: { phone: { contains: search } } },
      { user: { firstName: { contains: search } } },
    ];
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, phone: true } },
        items: { take: 1 },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    success: true,
    data: { orders, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } },
  });
});

// ─────────────────────────────────────────
// ADMIN: UPDATE ORDER STATUS
// ─────────────────────────────────────────
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note, trackingNumber, shippingCarrier } = req.body;

  const order = await prisma.order.findUnique({ where: { id }, include: { user: true } });
  if (!order) throw new AppError('Order not found.', 404);

  await prisma.order.update({
    where: { id },
    data: {
      status,
      ...(trackingNumber && { trackingNumber }),
      ...(shippingCarrier && { shippingCarrier }),
      ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
    },
  });

  await prisma.orderStatusHistory.create({
    data: { orderId: id, status, note, createdBy: req.user.userId },
  });

  // Notify customer
  await orderQueue.add('order-status-update', {
    orderId: id,
    userId: order.userId,
    phone: order.user.phone,
    orderNumber: order.orderNumber,
    status,
    trackingNumber,
  });

  res.json({ success: true, message: 'Order status updated.' });
});
