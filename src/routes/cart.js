const express = require('express');
const { authenticate } = require('../middleware/auth.js');

const router = express.Router();

// Get cart
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      cart: {
        _id: 'cart1',
        items: [],
        totalItems: 0,
        totalAmount: 0
      }
    }
  });
});

// Add to cart
router.post('/items', (req, res) => {
  res.json({
    success: true,
    message: 'Item added to cart',
    data: {
      cart: {
        _id: 'cart1',
        items: [{ _id: 'item1', quantity: 1 }],
        totalItems: 1,
        totalAmount: 2500
      }
    }
  });
});

// Clear cart
router.delete('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cart cleared'
  });
});

module.exports = router;