import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrder, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// User routes (require authentication)
router.post('/', authenticate, validate(schemas.createOrder), createOrder);
router.get('/', authenticate, validate(schemas.pagination), getOrders);
router.get('/:id', authenticate, validate(schemas.mongoId), getOrder);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, validate(schemas.pagination), getAllOrders);
router.put('/:id/status', authenticate, requireAdmin, validate(schemas.mongoId), updateOrderStatus);

export default router;