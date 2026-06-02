// src/jobs/cron.js
import cron from 'node-cron';
import prisma from '../utils/db.js';
import logger from '../utils/logger.js';

export function startCronJobs() {
  // ─────────────────────────────────────────
  // Clean expired OTPs - every 15 minutes
  // ─────────────────────────────────────────
  cron.schedule('*/15 * * * *', async () => {
    try {
      const deleted = await prisma.otp.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { usedAt: { not: null } },
          ],
        },
      });
      if (deleted.count > 0) logger.info(`Cron: Cleaned ${deleted.count} expired OTPs`);
    } catch (err) {
      logger.error('Cron: OTP cleanup failed', err.message);
    }
  });

  // ─────────────────────────────────────────
  // Clean expired refresh tokens - daily at 2am
  // ─────────────────────────────────────────
  cron.schedule('0 2 * * *', async () => {
    try {
      const deleted = await prisma.refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });
      logger.info(`Cron: Cleaned ${deleted.count} expired refresh tokens`);
    } catch (err) {
      logger.error('Cron: Refresh token cleanup failed', err.message);
    }
  });

  // ─────────────────────────────────────────
  // Recalculate product ratings - every 30 min
  // ─────────────────────────────────────────
  cron.schedule('*/30 * * * *', async () => {
    try {
      const products = await prisma.product.findMany({
        where: { reviews: { some: { status: 'APPROVED' } } },
        include: {
          _count: { select: { reviews: { where: { status: 'APPROVED' } } } },
        },
        select: { id: true },
      });

      for (const product of products) {
        const stats = await prisma.review.aggregate({
          where: { productId: product.id, status: 'APPROVED' },
          _avg: { rating: true },
          _count: { rating: true },
        });

        await prisma.product.update({
          where: { id: product.id },
          data: {
            avgRating: Math.round((stats._avg.rating || 0) * 10) / 10,
            reviewCount: stats._count.rating,
          },
        });
      }

      logger.info('Cron: Product ratings updated');
    } catch (err) {
      logger.error('Cron: Rating update failed', err.message);
    }
  });

  // ─────────────────────────────────────────
  // Auto-cancel unpaid orders after 24hrs - every hour
  // ─────────────────────────────────────────
  cron.schedule('0 * * * *', async () => {
    try {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const cancelled = await prisma.order.updateMany({
        where: {
          status: 'PENDING',
          paymentStatus: 'PENDING',
          createdAt: { lt: cutoff },
        },
        data: {
          status: 'CANCELLED',
          cancelReason: 'Payment not completed within 24 hours.',
        },
      });
      if (cancelled.count > 0) {
        logger.info(`Cron: Auto-cancelled ${cancelled.count} unpaid orders`);
      }
    } catch (err) {
      logger.error('Cron: Auto-cancel failed', err.message);
    }
  });

  // ─────────────────────────────────────────
  // Expire loyalty points - monthly on 1st at 3am
  // ─────────────────────────────────────────
  cron.schedule('0 3 1 * *', async () => {
    try {
      // Points older than 12 months expire
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 1);

      const expiring = await prisma.loyaltyLog.groupBy({
        by: ['userId'],
        where: { type: 'earn', createdAt: { lt: cutoff } },
        _sum: { points: true },
      });

      for (const record of expiring) {
        await prisma.user.update({
          where: { id: record.userId },
          data: { loyaltyPoints: { decrement: record._sum.points } },
        });
        await prisma.loyaltyLog.create({
          data: {
            userId: record.userId,
            points: -(record._sum.points),
            type: 'expire',
            description: 'Points expired (12 months)',
          },
        });
      }

      logger.info(`Cron: Processed ${expiring.length} loyalty point expirations`);
    } catch (err) {
      logger.error('Cron: Loyalty expiry failed', err.message);
    }
  });

  // ─────────────────────────────────────────
  // Clear old recently viewed entries - weekly
  // ─────────────────────────────────────────
  cron.schedule('0 4 * * 0', async () => {
    try {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const deleted = await prisma.recentlyViewed.deleteMany({
        where: { viewedAt: { lt: cutoff } },
      });
      logger.info(`Cron: Cleaned ${deleted.count} old recently viewed records`);
    } catch (err) {
      logger.error('Cron: Recently viewed cleanup failed', err.message);
    }
  });

  // ─────────────────────────────────────────
  // Cache warmup (no Redis) - every 5 mins
  // ─────────────────────────────────────────
  cron.schedule('*/5 * * * *', async () => {
    try {
      // Preload featured products into memory (no-op caching)
      const featured = await prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        include: { images: { where: { isPrimary: true }, take: 1 }, brand: { select: { name: true } } },
        take: 8,
      });
      logger.info(`Cron: Warmed up ${featured.length} featured products (no Redis)`);
    } catch (err) {
      logger.warn('Cron: Cache warmup skipped:', err.message);
    }
  });

  logger.info('⏰ All cron jobs scheduled');
}
