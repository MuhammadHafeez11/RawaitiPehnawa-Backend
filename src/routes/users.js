import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  getAllUsers, 
  updateUserRole 
} from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// User routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Admin routes
router.get('/', authenticate, requireAdmin, validate(schemas.pagination), getAllUsers);
router.put('/:id/role', authenticate, requireAdmin, validate(schemas.mongoId), updateUserRole);

export default router;