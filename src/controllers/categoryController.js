import Category from '../models/Category.js';
import Product from '../models/Product.js';

/**
 * Get all categories
 * @route GET /api/categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('subcategories')
      .sort('sortOrder name')
      .lean();

    // Add product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id, 
          isActive: true 
        });
        return { ...category, productCount };
      })
    );

    res.json({
      success: true,
      data: { categories: categoriesWithCount }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single category by ID or slug
 * @route GET /api/categories/:id
 */
export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let category = await Category.findById(id).populate('subcategories');
    
    if (!category) {
      category = await Category.findOne({ slug: id, isActive: true }).populate('subcategories');
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new category (Admin only)
 * @route POST /api/categories
 */
export const createCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    
    // Verify parent category exists if provided
    if (categoryData.parentCategory) {
      const parentCategory = await Category.findById(categoryData.parentCategory);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category (Admin only)
 * @route PUT /api/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verify parent category exists if being updated
    if (updateData.parentCategory) {
      const parentCategory = await Category.findById(updateData.parentCategory);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
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
    next(error);
  }
};

/**
 * Delete category (Admin only)
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

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
    next(error);
  }
};