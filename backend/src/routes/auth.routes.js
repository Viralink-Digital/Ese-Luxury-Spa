// src/routes/auth.routes.js
import { Router } from 'express';
import {
  register,
  verifyRegistrationOtp,
  login,
  verifyLoginOtp,
  refreshToken,
  logout,
  requestPasswordReset,
  resetPassword,
  resendOtp,
  me,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Registration flow
router.post('/register', validate(registerSchema), register);
router.post('/verify-registration', validate(verifyOtpSchema), verifyRegistrationOtp);

// Login flow
router.post('/login', validate(loginSchema), login);
router.post('/verify-login', validate(verifyOtpSchema), verifyLoginOtp);

// Token management
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);

// Password reset
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// OTP resend
router.post('/resend-otp', resendOtp);

// Current user
router.get('/me', authenticate, me);

export default router;
