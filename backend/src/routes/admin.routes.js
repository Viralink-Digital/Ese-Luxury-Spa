// src/routes/admin.routes.js
import { Router } from 'express';
import prisma from '../utils/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate, requireAdmin);

// ─── DASHBOARD ANALYTICS ───────────────────────────────────
router.get('/dashboard', asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    totalOrders, totalRevenue, totalCustomers, totalProducts,
    recentOrders, topProducts, ordersByStatus, revenueByDay,
    newCustomers, pendingReviews,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: from } } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAID', createdAt: { gte: from } }, _sum: { total: true } }),
    prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: from } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      where: { createdAt: { gte: from } },
      include: { user: { select: { firstName: true, lastName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { totalSold: 'desc' },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 5,
    }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
    prisma.$queryRaw`
      SELECT DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders
      FROM orders
      WHERE payment_status = 'PAID' AND created_at >= ${from}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
    prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: from } } }),
    prisma.review.count({ where: { status: 'PENDING' } }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalCustomers,
        totalProducts,
        newCustomers,
        pendingReviews,
      },
      recentOrders,
      topProducts,
      ordersByStatus,
      revenueByDay,
    },
  });
}));

// ─── CUSTOMER MANAGEMENT ────────────────────────────────────
router.get('/customers', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const where = { role: 'CUSTOMER' };
  if (search) {
    where.OR = [
      { phone: { contains: search } },
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
    ];
  }
  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
      skip, take: parseInt(limit),
    }),
    prisma.user.count({ where }),
  ]);
  res.json({ success: true, data: { customers, total, totalPages: Math.ceil(total / parseInt(limit)) } });
}));

router.patch('/customers/:id/status', asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  await prisma.user.update({ where: { id: req.params.id }, data: { isActive } });
  res.json({ success: true, message: `Customer ${isActive ? 'activated' : 'suspended'}.` });
}));

// ─── INVENTORY ──────────────────────────────────────────────
router.get('/inventory', asyncHandler(async (req, res) => {
  const { lowStock } = req.query;
  const variants = await prisma.productVariant.findMany({
    where: lowStock === 'true' ? { stockQty: { lte: 10 } } : {},
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { stockQty: 'asc' },
  });
  res.json({ success: true, data: { variants } });
}));

router.patch('/inventory/:variantId', asyncHandler(async (req, res) => {
  const { stockQty } = req.body;
  const variant = await prisma.productVariant.update({
    where: { id: req.params.variantId },
    data: { stockQty: parseInt(stockQty) },
  });
  res.json({ success: true, data: { variant } });
}));

export default router;
