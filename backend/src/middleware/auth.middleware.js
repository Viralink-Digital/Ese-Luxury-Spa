// src/middleware/auth.middleware.js
import { verifyAccessToken } from '../utils/jwt.js';
import prisma from '../utils/db.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication required.', 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token, { allowExpired: true });
  req.authExpired = typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, isActive: true, phone: true, firstName: true, email: true },
  });

  if (!user) throw new AppError('User not found.', 401);
  if (!user.isActive) throw new AppError('Account suspended.', 403);

  req.user = { userId: user.id, role: user.role, phone: user.phone, firstName: user.firstName };
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);
      req.user = payload;
    }
  } catch {
    // Ignore auth errors for optional auth
  }
  next();
});

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) throw new AppError('Authentication required.', 401);
  if (!roles.includes(req.user.role)) {
    throw new AppError('Insufficient permissions.', 403);
  }
  next();
};

export const requireAdmin = requireRole('ADMIN', 'SUPER_ADMIN');
export const requireSuperAdmin = requireRole('SUPER_ADMIN');
