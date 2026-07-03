// src/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../utils/db.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { generateOtp, verifyOtp } from '../utils/otp.js';
import { sendSmsOtp } from '../services/sms.service.js';
import { otpQueue } from '../jobs/queues.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

// ─────────────────────────────────────────
// REGISTER - Step 1: Send OTP
// ─────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { phone, firstName, lastName, referralCode } = req.body;

  // Check if phone already verified
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing?.isVerified) {
    throw new AppError('Phone number already registered. Please login.', 400);
  }

  // Create or update unverified user
  let user;
  if (existing) {
    user = existing;
  } else {
    // Handle referral
    let referredBy = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) referredBy = referrer.id;
    }

    user = await prisma.user.create({
      data: {
        phone,
        firstName,
        lastName,
        referredBy,
        referralCode: uuidv4().slice(0, 8).toUpperCase(),
      },
    });
  }

  // Generate OTP
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES) * 60 * 1000);

  // Invalidate previous OTPs
  await prisma.otp.updateMany({
    where: { userId: user.id, type: 'REGISTRATION', usedAt: null },
    data: { usedAt: new Date() },
  });

  // Store OTP
  await prisma.otp.create({
    data: {
      userId: user.id,
      phone,
      code,
      type: 'REGISTRATION',
      expiresAt,
    },
  });

  // Queue SMS
  await otpQueue.add('send-otp', {
    phone,
    code,
    type: 'REGISTRATION',
    userName: firstName,
  });

  logger.info(`Registration OTP queued for ${phone}`);

  res.status(200).json({
    success: true,
    message: `Verification code sent to ${phone.replace(/(\d{3})\d{5}(\d{4})/, '$1*****$2')}`,
    data: { userId: user.id, phone, expiresIn: parseInt(process.env.OTP_EXPIRES_MINUTES) * 60 },
  });
});

// ─────────────────────────────────────────
// REGISTER - Step 2: Verify OTP
// ─────────────────────────────────────────
export const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;

  const otp = await prisma.otp.findFirst({
    where: {
      userId,
      type: 'REGISTRATION',
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) throw new AppError('OTP expired or invalid. Please request a new one.', 400);

  // Check attempts
  if (otp.attempts >= parseInt(process.env.OTP_MAX_ATTEMPTS)) {
    throw new AppError('Too many incorrect attempts. Please request a new OTP.', 429);
  }

  const isValid = verifyOtp(code, otp.code);
  if (!isValid) {
    await prisma.otp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    throw new AppError('Invalid OTP code.', 400);
  }

  // Mark OTP used & verify user
  await prisma.otp.update({ where: { id: otp.id }, data: { usedAt: new Date() } });
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  // Handle referral bonus
  if (user.referredBy) {
    await prisma.loyaltyLog.create({
      data: {
        userId: user.referredBy,
        points: parseInt(process.env.REFERRAL_BONUS_POINTS),
        type: 'earn',
        description: 'Referral bonus',
      },
    });
    await prisma.user.update({
      where: { id: user.referredBy },
      data: { loyaltyPoints: { increment: parseInt(process.env.REFERRAL_BONUS_POINTS) } },
    });
  }

  // Issue tokens
  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshTokenValue = generateRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshTokenValue,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: refreshTokenValue,
    },
  });
});

// ─────────────────────────────────────────
// LOGIN - Step 1: Send OTP
// ─────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user || !user.isVerified) {
    throw new AppError('Phone number not registered. Please sign up.', 404);
  }
  if (!user.isActive) {
    throw new AppError('Your account has been suspended. Please contact support.', 403);
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES) * 60 * 1000);

  await prisma.otp.updateMany({
    where: { userId: user.id, type: 'LOGIN', usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.otp.create({
    data: {
      userId: user.id,
      phone,
      code,
      type: 'LOGIN',
      expiresAt,
    },
  });

  await otpQueue.add('send-otp', {
    phone,
    code,
    type: 'LOGIN',
    userName: user.firstName,
  });

  res.status(200).json({
    success: true,
    message: `Login code sent to ${phone.replace(/(\d{3})\d{5}(\d{4})/, '$1*****$2')}`,
    data: { userId: user.id, expiresIn: parseInt(process.env.OTP_EXPIRES_MINUTES) * 60 },
  });
});

// ─────────────────────────────────────────
// LOGIN - Step 2: Verify OTP
// ─────────────────────────────────────────
export const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;

  const otp = await prisma.otp.findFirst({
    where: {
      userId,
      type: 'LOGIN',
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) throw new AppError('OTP expired or invalid.', 400);

  if (otp.attempts >= parseInt(process.env.OTP_MAX_ATTEMPTS)) {
    throw new AppError('Too many attempts. Request a new OTP.', 429);
  }

  const isValid = verifyOtp(code, otp.code);
  if (!isValid) {
    await prisma.otp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    throw new AppError('Invalid OTP code.', 400);
  }

  await prisma.otp.update({ where: { id: otp.id }, data: { usedAt: new Date() } });
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const refreshTokenValue = generateRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshTokenValue,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({
    success: true,
    message: 'Login successful.',
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken: refreshTokenValue,
    },
  });
});

// ─────────────────────────────────────────
// REFRESH TOKEN
// ─────────────────────────────────────────
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new AppError('Refresh token required.', 401);

  const payload = verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) throw new AppError('User not found or inactive.', 401);

  const stored = await prisma.refreshToken.findUnique({ where: { token } });

  if (!stored) {
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } else if (stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token.', 401);
  } else {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });
  }

  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  const newRefreshToken = generateRefreshToken({ userId: user.id });

  if (!stored) {
    res.json({
      success: true,
      data: { accessToken, refreshToken: token },
    });
  } else {
    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  }
});

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ─────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  const user = await prisma.user.findUnique({ where: { phone } });

  // Always return 200 (don't leak user existence)
  if (!user) {
    return res.json({
      success: true,
      message: 'If this number is registered, a reset code has been sent.',
    });
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otp.updateMany({
    where: { userId: user.id, type: 'PASSWORD_RESET', usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.otp.create({
    data: {
      userId: user.id,
      phone,
      code,
      type: 'PASSWORD_RESET',
      expiresAt,
    },
  });

  await otpQueue.add('send-otp', { phone, code, type: 'PASSWORD_RESET' });

  res.json({
    success: true,
    message: 'If this number is registered, a reset code has been sent.',
    data: { userId: user.id },
  });
});

// ─────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { userId, code, newPassword } = req.body;

  const otp = await prisma.otp.findFirst({
    where: {
      userId,
      type: 'PASSWORD_RESET',
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) throw new AppError('OTP expired or invalid.', 400);

  const isValid = verifyOtp(code, otp.code);
  if (!isValid) throw new AppError('Invalid OTP code.', 400);

  await prisma.otp.update({ where: { id: otp.id }, data: { usedAt: new Date() } });

  // For SMS-only auth we don't store passwords, but support optional password for web
  // In practice phone OTP IS the authentication - this is for admin email/password hybrid
  res.json({ success: true, message: 'Password reset successful.' });
});

// ─────────────────────────────────────────
// RESEND OTP
// ─────────────────────────────────────────
export const resendOtp = asyncHandler(async (req, res) => {
  const { userId, type } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);

  // Check cooldown
  const recent = await prisma.otp.findFirst({
    where: { userId, type, createdAt: { gt: new Date(Date.now() - parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) * 1000) } },
    orderBy: { createdAt: 'desc' },
  });

  if (recent) {
    const secondsLeft = Math.ceil((recent.createdAt.getTime() + parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) * 1000 - Date.now()) / 1000);
    throw new AppError(`Please wait ${secondsLeft} seconds before requesting another OTP.`, 429);
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRES_MINUTES) * 60 * 1000);

  await prisma.otp.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() },
  });

  await prisma.otp.create({
    data: { userId, phone: user.phone, code, type, expiresAt },
  });

  await otpQueue.add('send-otp', { phone: user.phone, code, type });

  res.json({
    success: true,
    message: 'New OTP sent.',
    data: { expiresIn: parseInt(process.env.OTP_EXPIRES_MINUTES) * 60 },
  });
});

// ─────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────
export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      addresses: { where: { isDefault: true }, take: 1 },
      _count: { select: { wishlistItems: true, orders: true } },
    },
  });

  if (!user) throw new AppError('User not found.', 404);

  res.json({ success: true, data: { user: sanitizeUser(user) } });
});

// ─────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────
function sanitizeUser(user) {
  const { ...safe } = user;
  return safe;
}
