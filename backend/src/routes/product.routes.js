// src/routes/product.routes.js
import { Router } from 'express';
import {
  getProducts, getProduct, getRelatedProducts,
  createProduct, updateProduct, deleteProduct,
} from '../controllers/product.controller.js';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', optionalAuth, getProducts);
router.get('/:slug', optionalAuth, getProduct);
router.get('/:productId/related', getRelatedProducts);
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);
export default router;
