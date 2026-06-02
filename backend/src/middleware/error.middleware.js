// src/middleware/error.middleware.js
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found.';
  }
  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Invalid reference to related record.';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired.';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // Log non-operational errors
  if (!err.isOperational) {
    logger.error('Unexpected error:', { message: err.message, stack: err.stack, url: req.url });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
