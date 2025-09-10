const express = require('express');
const { authenticate } = require('../middleware/auth.js');

const router = express.Router();

// Get orders
router.get('/', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      pagination: { page: 1, totalPages: 1, total: 0 }
    }
  });
});

// Create order
router.post('/', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Order created successfully',
    data: {
      order: {
        _id: 'order-' + Date.now(),
        orderNumber: 'ORD-' + Date.now(),
        status: 'pending',
        total: 2500
      }
    }
  });
});

module.exports = router;