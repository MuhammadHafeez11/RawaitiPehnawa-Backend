const express = require('express');
const { adminAuth } = require('../middleware/auth.js');

const router = express.Router();

// Get guest orders (admin)
router.get('/admin', adminAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      pagination: { page: 1, totalPages: 1, total: 0 }
    }
  });
});

// Create guest order
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Guest order created successfully',
    data: {
      order: {
        _id: 'guest-order-' + Date.now(),
        orderNumber: 'GO-' + Date.now(),
        status: 'pending',
        total: 2500
      }
    }
  });
});

module.exports = router;