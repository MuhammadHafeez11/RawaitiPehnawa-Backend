import express from 'express';
import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import { adminAuth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 });
    
    // Add product count for each collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const productCount = await Product.countDocuments({
          collections: collection._id,
          isActive: true
        });
        return {
          ...collection.toObject(),
          productCount
        };
      })
    );
    
    res.json({
      success: true,
      data: { collections: collectionsWithCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collections',
      error: error.message
    });
  }
});

// Get collection by slug
router.get('/:slug', async (req, res) => {
  try {
    const collection = await Collection.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.json({
      success: true,
      data: { collection }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection',
      error: error.message
    });
  }
});

// Create collection (Admin only)
router.post('/', 
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('Collection name is required'),
    body('slug').trim().notEmpty().withMessage('Collection slug is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const collection = new Collection(req.body);
      await collection.save();
      
      res.status(201).json({
        success: true,
        message: 'Collection created successfully',
        data: { collection }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Collection with this slug already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create collection',
        error: error.message
      });
    }
  }
);

// Update collection (Admin only)
router.put('/:id', 
  adminAuth,
  async (req, res) => {
    try {
      const collection = await Collection.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Collection updated successfully',
        data: { collection }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update collection',
        error: error.message
      });
    }
  }
);

// Delete collection (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete collection',
      error: error.message
    });
  }
});

export default router;