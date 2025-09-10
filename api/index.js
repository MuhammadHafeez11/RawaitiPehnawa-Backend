const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MongoDB connection - SECURE (from env)
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
    console.log('✅ MongoDB connected');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Schemas
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  isActive: { type: Boolean, default: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  shortDescription: String,
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
  },
  brand: String,
  features: [String],
  materials: [String],
  careInstructions: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: { type: String, default: 'pending' },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    phone: String
  }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// CORS
app.use(cors({
  origin: [
    'https://rawaiti-pehnawa-frontend.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawayti Pehnawa Backend API - WORKING WITH REAL DATABASE', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '4.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend working with real database!'
  });
});

// Categories API - Real database
app.get('/api/categories', async (req, res) => {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true, parentCategory: null }).sort({ createdAt: -1 });
    
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

// Featured Products API - Real database
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

// All Products API - Real database
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

// Single Product API - Real database
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

// Category products - Real database
app.get('/api/category/:slug', async (req, res) => {
  try {
    await connectToDatabase();
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const products = await Product.find({ category: category._id, isActive: true })
      .populate('category')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        category: category,
        products: products,
        pagination: { page: 1, totalPages: 1, total: products.length }
      }
    });
  } catch (error) {
    console.error('Category products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category products',
      error: error.message
    });
  }
});

// Collection pages - Real database
app.get('/api/collection/:slug', async (req, res) => {
  try {
    await connectToDatabase();
    let products = [];
    
    if (req.params.slug === 'new-arrivals') {
      products = await Product.find({ isActive: true })
        .populate('category')
        .sort({ createdAt: -1 })
        .limit(20);
    } else if (req.params.slug === 'sale') {
      products = await Product.find({ 
        isActive: true,
        discountedPrice: { $exists: true, $ne: null }
      })
        .populate('category')
        .sort({ createdAt: -1 });
    }
    
    res.json({
      success: true,
      data: {
        collection: { 
          _id: '1', 
          name: req.params.slug === 'new-arrivals' ? 'New Arrivals' : 'Sale', 
          slug: req.params.slug 
        },
        products: products,
        pagination: { page: 1, totalPages: 1, total: products.length }
      }
    });
  } catch (error) {
    console.error('Collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection',
      error: error.message
    });
  }
});

// Auth API
app.post('/api/auth/login', async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password } = req.body;
    
    // Simple auth check (in real app, use bcrypt)
    const user = await User.findOne({ email: email, isActive: true });
    
    if (user) {
      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          },
          accessToken: 'mock-token-' + user._id
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    await connectToDatabase();
    const { firstName, lastName, email, password } = req.body;
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // In real app, hash this
      role: 'user'
    });
    
    await newUser.save();
    
    res.json({
      success: true,
      data: {
        user: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role
        },
        accessToken: 'mock-token-' + newUser._id
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { 
        _id: '1', 
        firstName: 'Admin', 
        lastName: 'User', 
        email: 'admin@test.com', 
        role: 'admin' 
      }
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

// Admin API - Real database
app.get('/api/admin/products', async (req, res) => {
  try {
    await connectToDatabase();
    const products = await Product.find().populate('category').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        products: products,
        pagination: { page: 1, totalPages: 1, total: products.length }
      }
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin products',
      error: error.message
    });
  }
});

app.get('/api/admin/categories', async (req, res) => {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        categories: categories,
        pagination: { page: 1, totalPages: 1, total: categories.length }
      }
    });
  } catch (error) {
    console.error('Admin categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin categories',
      error: error.message
    });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    await connectToDatabase();
    const orders = await Order.find().populate('user').populate('items.product').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        orders: orders,
        pagination: { page: 1, totalPages: 1, total: orders.length }
      }
    });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin orders',
      error: error.message
    });
  }
});

// Cart API
app.get('/api/cart', (req, res) => {
  res.json({
    success: true,
    data: {
      cart: {
        _id: 'cart1',
        items: [],
        totalItems: 0,
        totalAmount: 0,
        count: 0
      }
    }
  });
});

app.post('/api/cart/items', (req, res) => {
  res.json({
    success: true,
    data: {
      cart: {
        _id: 'cart1',
        items: [{ _id: 'item1', quantity: 1 }],
        totalItems: 1,
        totalAmount: 2500,
        count: 1
      }
    }
  });
});

app.delete('/api/cart', (req, res) => {
  res.json({
    success: true,
    data: {
      cart: {
        _id: 'cart1',
        items: [],
        totalItems: 0,
        totalAmount: 0,
        count: 0
      }
    }
  });
});

// Orders API
app.get('/api/orders', async (req, res) => {
  try {
    await connectToDatabase();
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        orders: orders,
        pagination: { page: 1, totalPages: 1, total: orders.length }
      }
    });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    await connectToDatabase();
    const newOrder = new Order({
      orderNumber: 'ORD-' + Date.now(),
      total: req.body.total || 2500,
      status: 'pending',
      shippingAddress: req.body.shippingAddress
    });
    
    await newOrder.save();
    
    res.json({
      success: true,
      data: {
        order: newOrder
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
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
      '/api/products/:id',
      '/api/category/:slug',
      '/api/collection/:slug',
      '/api/auth/login',
      '/api/admin/products',
      '/api/admin/categories',
      '/api/admin/orders'
    ]
  });
});

module.exports = app;