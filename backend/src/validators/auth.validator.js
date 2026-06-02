// src/validators/auth.validator.js
import { z } from 'zod';

const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number too long')
  .regex(/^[+\d\s-()]+$/, 'Invalid phone number format');

export const registerSchema = z.object({
  phone: phoneSchema,
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export const resetPasswordSchema = z.object({
  userId: z.string().uuid(),
  code: z.string().length(6).regex(/^\d+$/),
  newPassword: z.string().min(8).optional(),
});
