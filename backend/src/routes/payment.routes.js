// src/routes/payment.routes.js
import { Router } from 'express';
import { verifyWebhookSignature, verifyPayment } from '../services/korapay.service.js';
import prisma from '../utils/db.js';
import { orderQueue } from '../jobs/queues.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

const router = Router();

// Korapay webhook - raw body already set in app.js
router.post('/webhook', asyncHandler(async (req, res) => {
  const signature = req.headers['x-korapay-signature'];
  const payload = JSON.parse(req.body.toString());

  if (!verifyWebhookSignature(payload, signature)) {
    logger.warn('Invalid Korapay webhook signature');
    return res.status(401).json({ message: 'Invalid signature' });
  }

  const { event, data } = payload;
  logger.info(`Korapay webhook: ${event}`, { reference: data?.reference });

  if (event === 'charge.success') {
    const order = await prisma.order.findUnique({ where: { orderNumber: data.reference }, include: { user: true } });
    if (order && order.paymentStatus !== 'PAID') {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', paymentRef: data.reference, status: 'CONFIRMED' },
      });
      await prisma.orderStatusHistory.create({
        data: { orderId: order.id, status: 'CONFIRMED', note: 'Payment confirmed via webhook' },
      });
      await orderQueue.add('order-confirmed', {
        orderId: order.id,
        phone: order.user.phone,
        orderNumber: order.orderNumber,
        total: order.total,
      });
    }
  }

  if (event === 'charge.failed') {
    await prisma.order.updateMany({
      where: { orderNumber: data.reference, paymentStatus: 'PENDING' },
      data: { paymentStatus: 'FAILED' },
    });
  }

  res.json({ received: true });
}));

export default router;
