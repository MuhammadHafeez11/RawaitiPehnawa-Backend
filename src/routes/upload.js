const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth.js');

const router = express.Router();

// Upload single image
router.post('/image', authenticate, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      publicId: 'sample-image-id'
    }
  });
});

// Upload multiple images
router.post('/images', authenticate, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Images uploaded successfully',
    data: {
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          publicId: 'sample-image-1'
        }
      ]
    }
  });
});

module.exports = router;