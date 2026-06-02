// src/services/sms.service.js
import axios from 'axios';
import logger from '../utils/logger.js';

const TEXTBEE_BASE = process.env.TEXTBEE_BASE_URL;
const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

const OTP_TEMPLATES = {
  REGISTRATION: (code, name) =>
    `Hi ${name || 'there'}! Your Ese Luxury Cosmetics verification code is: ${code}. Valid for ${process.env.OTP_EXPIRES_MINUTES} minutes. Do not share this code.`,
  LOGIN: (code, name) =>
    `Hi ${name || 'there'}! Your Ese Luxury login code is: ${code}. Valid for ${process.env.OTP_EXPIRES_MINUTES} minutes. If you didn't request this, ignore.`,
  PASSWORD_RESET: (code) =>
    `Your Ese Luxury password reset code is: ${code}. Valid for 10 minutes. Do not share this code.`,
  ORDER_NOTIFICATION: (details) =>
    `Ese Luxury: ${details}`,
};

export async function sendSmsOtp({ phone, code, type, userName }) {
  const message = OTP_TEMPLATES[type]?.(code, userName) ||
    `Your Ese Luxury code is: ${code}. Valid for ${process.env.OTP_EXPIRES_MINUTES} minutes.`;

  return sendSms({ phone, message });
}

export async function sendOrderSms({ phone, message }) {
  return sendSms({ phone, message: OTP_TEMPLATES.ORDER_NOTIFICATION(message) });
}

async function sendSms({ phone, message }) {
  // Normalize phone (ensure +234 format for Nigeria)
  const normalized = normalizePhone(phone);

  try {
    const response = await axios.post(
      `${TEXTBEE_BASE}/gateway/devices/${DEVICE_ID}/send-sms`,
      {
        recipients: [normalized],
        message,
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    logger.info(`SMS sent to ${normalized}: ${response.data?.message || 'success'}`);
    return { success: true, data: response.data };
  } catch (err) {
    logger.error(`SMS failed to ${normalized}:`, err.response?.data || err.message);
    // Don't throw — SMS failure shouldn't break the flow, just log
    return { success: false, error: err.message };
  }
}

function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  if (digits.length === 10) return `+234${digits}`;
  return `+${digits}`;
}
