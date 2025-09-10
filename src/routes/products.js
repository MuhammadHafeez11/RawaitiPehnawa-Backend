const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getFeaturedProducts 
} = require('../controllers/productController.js');
const { authenticate, requireAdmin } = require('../middleware/auth.js');
const { validate, schemas } = require('../middleware/validation.js');

const router = express.Router();

// Public routes
router.get('/', validate(schemas.pagination), getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', authenticate, requireAdmin, createProduct);
router.put('/:id', authenticate, requireAdmin, validate(schemas.mongoId), updateProduct);
router.delete('/:id', authenticate, requireAdmin, validate(schemas.mongoId), deleteProduct);

module.exports = router;