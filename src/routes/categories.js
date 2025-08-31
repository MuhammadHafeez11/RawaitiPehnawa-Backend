import express from 'express';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', authenticate, requireAdmin, validate(schemas.createCategory), createCategory);
router.put('/:id', authenticate, requireAdmin, validate(schemas.mongoId), updateCategory);
router.delete('/:id', authenticate, requireAdmin, validate(schemas.mongoId), deleteCategory);

export default router;