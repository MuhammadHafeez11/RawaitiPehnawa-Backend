// Vercel serverless entry point - CommonJS
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MongoDB connection for serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    cachedConnection = connection;
    console.log('✅ MongoDB connected for serverless');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// CORS configuration
app.use(cors({
  origin: [
    'https://rawaiti-pehnawa-frontend.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple Category Schema
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  isActive: { type: Boolean, default: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Simple Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  discountedPrice: Number,
  images: [{ url: String, alt: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  variants: [{
    size: String,
    stock: Number,
    price: Number,
    sku: String
  }],
  colors: [String],
  stock: Number,
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawayti Pehnawa Backend API - WORKING', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '3.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is working perfectly!'
  });
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        categories: categories
      }
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Featured Products API
app.get('/api/products/featured', async (req, res) => {
  try {
    await connectToDatabase();
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category')
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        products: products
      }
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
});

// All Products API
app.get('/api/products', async (req, res) => {
  try {
    await connectToDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const products = await Product.find({ isActive: true })
      .populate('category')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments({ isActive: true });
    
    res.json({
      success: true,
      data: {
        products: products,
        pagination: {
          page: page,
          limit: limit,
          total: total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Single Product API
app.get('/api/products/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        product: product
      }
    });
  } catch (error) {
    console.error('Single product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    availableRoutes: [
      '/',
      '/api/health',
      '/api/categories',
      '/api/products/featured',
      '/api/products',
      '/api/products/:id'
    ]
  });
});

module.exports = app;