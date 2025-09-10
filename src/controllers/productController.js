const Product = require('../models/Product.js');
const CategoryNew = require('../models/CategoryNew.js');
const Collection = require('../models/Collection.js');

/**
 * Get all products with filtering and pagination
 * @route GET /api/products
 */
const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, targetGender, stitchType, pieceCount, season, minPrice, maxPrice, sort = '-createdAt' } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (targetGender) {
      filter.targetGender = targetGender;
    }
    
    if (stitchType) {
      filter.stitchType = stitchType;
    }
    
    if (pieceCount) {
      filter.pieceCount = Number(pieceCount);
    }
    
    if (season) {
      filter.season = season;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('collections', 'name slug')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID or slug
 * @route GET /api/products/:id
 */
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    
    if (!id || id === 'undefined' || id === 'null') {
      return res.status(400).json({
        success: false,
        message: 'Product ID or slug is required'
      });
    }
    
    let product;
    
    // Check if it's a valid ObjectId (24 character hex string)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id)
        .populate('category', 'name slug')
        .populate('collections', 'name slug');
    }
    
    // If not found by ID or not a valid ObjectId, try by slug
    if (!product) {
      product = await Product.findOne({ slug: id, isActive: true })
        .populate('category', 'name slug')
        .populate('collections', 'name slug');
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    next(error);
  }
};

/**
 * Create new product (Admin only)
 * @route POST /api/products
 */
const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    const product = await Product.create(productData);
    await product.populate('category', 'name slug');
    await product.populate('collections', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (Admin only)
 * @route PUT /api/products/:id
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug')
     .populate('collections', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (Admin only)
 * @route DELETE /api/products/:id
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 * @route GET /api/products/featured
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .populate('category', 'name slug')
      .populate('collections', 'name slug')
      .sort('-createdAt')
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};