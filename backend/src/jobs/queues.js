// src/jobs/queues.js
import bullmq from 'bullmq';
const { Queue, JobScheduler } = bullmq;
import { sendSmsOtp, sendOrderSms } from '../services/sms.service.js';
import prisma from '../utils/db.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const redisUrl = process.env.REDIS_URL?.trim();
const redisConnection = redisUrl
  ? { connection: { url: redisUrl, password: process.env.REDIS_PASSWORD || undefined } }
  : null;

function noopPromise() {
  return Promise.resolve();
}

async function fallbackProcessOtp(data) {
  const { phone, code, type, userName } = data;
  logger.info(`Processing OTP job in fallback mode for ${phone}`);
  await sendSmsOtp({ phone, code, type, userName });
}

async function fallbackProcessOrder(name, payload) {
  if (name === 'order-confirmed') {
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

  if (name === 'order-status-update') {
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
}

async function fallbackProcessImage(data) {
  const { filePath, outputDir } = data;
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
  logger.info(`Images processed in fallback mode for ${filePath}`);
}

function createBullQueue(queueName) {
  if (!redisConnection) {
    logger.warn(`Redis not configured, queue ${queueName} will run in fallback mode`);
    return null;
  }

  try {
    const queue = new Queue(queueName, redisConnection);
    new JobScheduler(queueName, redisConnection);
    queue.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        logger.warn(`Redis connection refused for ${queueName}, using fallback mode`);
      } else {
        logger.error(`BullMQ queue ${queueName} error:`, err);
      }
    });
    return queue;
  } catch (err) {
    logger.error(`Failed to initialize BullMQ queue ${queueName}:`, err.message);
    return null;
  }
}

async function addJob(queueInstance, queueName, name, data, fallbackHandler) {
  if (queueInstance) {
    try {
      return await queueInstance.add(name, data);
    } catch (err) {
      logger.error(`Failed to add ${name} to ${queueName}:`, err.message);
    }
  }

  setImmediate(async () => {
    try {
      await fallbackHandler(name, data);
    } catch (err) {
      logger.error(`Fallback job ${name} failed:`, err.message);
    }
  });
  return noopPromise();
}

const otpBullQueue = createBullQueue('otp-queue');
const orderBullQueue = createBullQueue('order-queue');
const imageBullQueue = createBullQueue('image-queue');
const analyticsBullQueue = createBullQueue('analytics-queue');

export const otpQueue = {
  add: async (name, data) => addJob(otpBullQueue, 'otp-queue', name, data, fallbackProcessOtp),
};

export const orderQueue = {
  add: async (name, payload) => addJob(orderBullQueue, 'order-queue', name, payload, fallbackProcessOrder),
};

export const imageQueue = {
  add: async (name, data) => addJob(imageBullQueue, 'image-queue', name, data, fallbackProcessImage),
};

export const analyticsQueue = {
  add: async (name, data) => {
    if (analyticsBullQueue) {
      try {
        return await analyticsBullQueue.add(name, data);
      } catch (err) {
        logger.error(`Failed to add ${name} to analytics-queue:`, err.message);
      }
    }
    return noopPromise();
  },
};
