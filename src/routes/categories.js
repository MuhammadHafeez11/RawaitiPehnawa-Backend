const express = require('express');
const { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController.js');
const { authenticate, requireAdmin } = require('../middleware/auth.js');
const { validate, schemas } = require('../middleware/validation.js');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', authenticate, requireAdmin, validate(schemas.createCategory), createCategory);
router.put('/:id', authenticate, requireAdmin, validate(schemas.mongoId), updateCategory);
router.delete('/:id', authenticate, requireAdmin, validate(schemas.mongoId), deleteCategory);

module.exports = router;