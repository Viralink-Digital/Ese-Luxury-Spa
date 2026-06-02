// src/services/korapay.service.js
import axios from 'axios';
import crypto from 'crypto';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const KORAPAY_BASE = process.env.KORAPAY_BASE_URL;
const SECRET_KEY = process.env.KORAPAY_SECRET_KEY;

const korapayClient = axios.create({
  baseURL: KORAPAY_BASE,
  headers: {
    Authorization: `Bearer ${SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ─────────────────────────────────────────
// INITIALIZE PAYMENT
// ─────────────────────────────────────────
export async function initializePayment({
  reference,
  amount,
  currency = 'NGN',
  customerName,
  customerEmail,
  customerPhone,
  redirectUrl,
  metadata = {},
}) {
  try {
    const response = await korapayClient.post('/charges/initialize', {
      reference,
      amount: Math.round(amount * 100), // Korapay uses kobo
      currency,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      redirect_url: redirectUrl,
      channels: ['card', 'bank_transfer', 'mobile_money'],
      metadata,
      notification_url: `${process.env.API_BASE_URL}/api/v1/payments/webhook`,
    });

    return response.data;
  } catch (err) {
    logger.error('Korapay initializePayment error:', err.response?.data || err.message);
    throw new AppError('Payment initialization failed. Please try again.', 502);
  }
}

// ─────────────────────────────────────────
// VERIFY PAYMENT
// ─────────────────────────────────────────
export async function verifyPayment(reference) {
  try {
    const response = await korapayClient.get(`/charges/${reference}`);
    return response.data;
  } catch (err) {
    logger.error('Korapay verifyPayment error:', err.response?.data || err.message);
    throw new AppError('Payment verification failed.', 502);
  }
}

// ─────────────────────────────────────────
// PROCESS REFUND
// ─────────────────────────────────────────
export async function processRefund({ reference, amount, reason }) {
  try {
    const response = await korapayClient.post('/refunds', {
      transaction_reference: reference,
      amount: Math.round(amount * 100),
      reason,
    });
    return response.data;
  } catch (err) {
    logger.error('Korapay refund error:', err.response?.data || err.message);
    throw new AppError('Refund processing failed.', 502);
  }
}

// ─────────────────────────────────────────
// VERIFY WEBHOOK SIGNATURE
// ─────────────────────────────────────────
export function verifyWebhookSignature(payload, signature) {
  const hash = crypto
    .createHmac('sha256', process.env.KORAPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
}
