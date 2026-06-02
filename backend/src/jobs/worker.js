// src/jobs/worker.js
import 'dotenv/config';
import bullmq from 'bullmq';
const { Worker, JobScheduler } = bullmq;
import { sendSmsOtp, sendOrderSms } from '../services/sms.service.js';
import prisma from '../utils/db.js';
import sharp from 'sharp';
import logger from '../utils/logger.js';
const redisUrl = process.env.REDIS_URL?.trim();
const redisConnection = redisUrl
  ? { connection: { url: redisUrl, password: process.env.REDIS_PASSWORD || undefined } }
  : null;

if (!redisConnection) {
  logger.warn('Redis worker disabled: REDIS_URL is not configured.');
  process.exit(0);
}

const queueNames = ['otp-queue', 'order-queue', 'image-queue', 'analytics-queue'];
queueNames.forEach((name) => new JobScheduler(name, redisConnection));

const otpWorker = new Worker(
  'otp-queue',
  async (job) => {
    const { phone, code, type, userName } = job.data;
    logger.info(`Processing OTP worker job: ${job.name} for ${phone}`);
    await sendSmsOtp({ phone, code, type, userName });
  },
  redisConnection
);

const orderWorker = new Worker(
  'order-queue',
  async (job) => {
    logger.info(`Processing order worker job: ${job.name}`);
    const payload = job.data;
    if (job.name === 'order-confirmed') {
      const { phone, orderNumber, total, orderId } = payload;
      await sendOrderSms({
        phone,
        message: `Your order #${orderNumber} has been confirmed! Total: ₦${parseFloat(total).toLocaleString()}. We'll notify you when it ships. Thank you for shopping with Ese Luxury! 💄`,
      });

      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (order) {
        for (const item of order.items) {
          await prisma.product.update({ where: { id: item.productId }, data: { totalSold: { increment: item.quantity } } });
        }
      }
    }

    if (job.name === 'order-status-update') {
      const { phone, orderNumber, status, trackingNumber } = payload;
      const messages = {
        PROCESSING: `Your order #${orderNumber} is being processed. We'll ship it soon!`,
        SHIPPED: `Great news! Your order #${orderNumber} has been shipped.${trackingNumber ? ` Track: ${trackingNumber}` : ''} Delivery in 3-5 days.`,
        DELIVERED: `Your order #${orderNumber} has been delivered! We hope you love your products. Rate your experience in the app.`,
        CANCELLED: `Your order #${orderNumber} has been cancelled. Any payment will be refunded within 3-5 business days.`,
      };
      const msg = messages[status];
      if (msg) await sendOrderSms({ phone, message: msg });
    }
  },
  redisConnection
);

const imageWorker = new Worker(
  'image-queue',
  async (job) => {
    const { filePath, outputDir } = job.data;
    logger.info(`Processing image worker job: ${job.name} for ${filePath}`);
    const filename = path.basename(filePath, path.extname(filePath));
    const sizes = [
      { width: 800, height: 800, suffix: 'lg' },
      { width: 400, height: 400, suffix: 'md' },
      { width: 200, height: 200, suffix: 'sm' },
    ];

    for (const size of sizes) {
      await sharp(filePath)
        .resize(size.width, size.height, { fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toFile(path.join(outputDir, `${filename}-${size.suffix}.webp`));
    }
  },
  redisConnection
);

const analyticsWorker = new Worker(
  'analytics-queue',
  async (job) => {
    logger.info(`Processing analytics worker job: ${job.name}`);
  },
  redisConnection
);

[otpWorker, orderWorker, imageWorker, analyticsWorker].forEach((worker) => {
  worker.on('completed', (job) => logger.info(`Job completed: ${job.queueName}:${job.name}`));
  worker.on('failed', (job, err) => logger.error(`Job failed: ${job?.queueName}:${job?.name}`, err?.message || err));
  worker.on('error', (err) => logger.error('Worker error:', err));
});

logger.info('BullMQ workers started for otp, order, image, and analytics queues.');

process.on('SIGTERM', async () => {
  logger.info('Worker process exiting.');
  await Promise.all([otpWorker.close(), orderWorker.close(), imageWorker.close(), analyticsWorker.close()]);
  process.exit(0);
});
