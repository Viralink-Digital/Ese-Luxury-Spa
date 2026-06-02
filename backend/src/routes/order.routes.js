// src/routes/order.routes.js
import { Router } from 'express';
import {
  createOrder, verifyOrderPayment, getUserOrders,
  getOrder, cancelOrder, adminGetOrders, updateOrderStatus,
} from '../controllers/order.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.use(authenticate);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.post('/:id/cancel', cancelOrder);
router.get('/verify/:reference', verifyOrderPayment);

// Admin
router.get('/admin/all', requireAdmin, adminGetOrders);
router.patch('/admin/:id/status', requireAdmin, updateOrderStatus);
export default router;
