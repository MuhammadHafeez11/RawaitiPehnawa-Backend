import express from 'express';
import CategoryNew from '../models/CategoryNew.js';
import Product from '../models/Product.js';
import { adminAuth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all categories with hierarchy
router.get('/', async (req, res) => {
  try {
    const { level, parentCategory, targetGender, stitchType } = req.query;
    
    let filter = { isActive: true };
    
    if (level !== undefined) filter.level = parseInt(level);
    if (parentCategory) filter.parentCategory = parentCategory;
    if (targetGender) filter.targetGender = targetGender;
    if (stitchType) filter.stitchType = stitchType;
    
    const categories = await CategoryNew.find(filter)
      .populate('parentCategory', 'name slug')
      .sort({ sortOrder: 1, createdAt: -1 });
    
    // Add product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          categories: category._id,
          isActive: true
        });
        return {
          ...category.toObject(),
          productCount
        };
      })
    );
    
    res.json({
      success: true,
      data: { categories: categoriesWithCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get category hierarchy tree
router.get('/tree', async (req, res) => {
  try {
    const { targetGender } = req.query;
    
    let filter = { isActive: true, level: 0 };
    if (targetGender) filter.targetGender = targetGender;
    
    const mainCategories = await CategoryNew.find(filter)
      .sort({ sortOrder: 1 });
    
    const categoryTree = [];
    
    for (const mainCat of mainCategories) {
      const subCategories = await CategoryNew.find({
        parentCategory: mainCat._id,
        isActive: true
      }).sort({ sortOrder: 1 });
      
      const categoryWithSubs = {
        ...mainCat.toObject(),
        subcategories: []
      };
      
      for (const subCat of subCategories) {
        const subSubCategories = await CategoryNew.find({
          parentCategory: subCat._id,
          isActive: true
        }).sort({ sortOrder: 1 });
        
        categoryWithSubs.subcategories.push({
          ...subCat.toObject(),
          subcategories: subSubCategories
        });
      }
      
      categoryTree.push(categoryWithSubs);
    }
    
    res.json({
      success: true,
      data: { categories: categoryTree }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category tree',
      error: error.message
    });
  }
});

// Get category by slug with full path
router.get('/:slug', async (req, res) => {
  try {
    const category = await CategoryNew.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).populate('parentCategory', 'name slug categoryPath');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get subcategories
    const subcategories = await CategoryNew.find({
      parentCategory: category._id,
      isActive: true
    }).sort({ sortOrder: 1 });
    
    res.json({
      success: true,
      data: { 
        category: {
          ...category.toObject(),
          subcategories
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
});

// Create category (Admin only)
router.post('/', 
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('slug').trim().notEmpty().withMessage('Category slug is required'),
    body('targetGender').isIn(['women', 'men', 'boys', 'girls', 'unisex']).withMessage('Invalid target gender'),
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

      const category = new CategoryNew(req.body);
      await category.save();
      
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Category with this slug already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message
      });
    }
  }
);

// Update category (Admin only)
router.put('/:id', 
  adminAuth,
  async (req, res) => {
    try {
      const category = await CategoryNew.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error.message
      });
    }
  }
);

// Delete category (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    // Check if category has subcategories
    const hasSubcategories = await CategoryNew.findOne({ parentCategory: req.params.id });
    if (hasSubcategories) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }
    
    const category = await CategoryNew.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

export default router;