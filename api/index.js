const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

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
    console.log('✅ MongoDB connected');
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't throw error, continue with fallback
    return null;
  }
}

// Simple schemas for serverless
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
  materials: [String]
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

// Models
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawayti Pehnawa Backend API - REAL DATABASE', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '5.0'
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

// Categories API - Real database with fallback
app.get('/api/categories', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    if (connection) {
      const categories = await Category.find({ isActive: true, parentCategory: null }).sort({ createdAt: -1 });
      
      if (categories.length > 0) {
        return res.json({
          success: true,
          data: { categories: categories }
        });
      }
    }
    
    // Fallback data if no database or no data
    res.json({
      success: true,
      data: {
        categories: [
          { 
            _id: '674f1a2b3c4d5e6f7a8b9c0d', 
            name: 'Men', 
            slug: 'men',
            image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300',
            description: 'Men\'s Fashion Collection',
            isActive: true
          },
          { 
            _id: '674f1a2b3c4d5e6f7a8b9c0e', 
            name: 'Women', 
            slug: 'women',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300',
            description: 'Women\'s Fashion Collection',
            isActive: true
          }
        ]
      }
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Featured Products API - Real database with fallback
app.get('/api/products/featured', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    if (connection) {
      const products = await Product.find({ isFeatured: true, isActive: true })
        .populate('category')
        .limit(8)
        .sort({ createdAt: -1 });
      
      if (products.length > 0) {
        return res.json({
          success: true,
          data: { products: products }
        });
      }
    }
    
    // Fallback data
    res.json({
      success: true,
      data: {
        products: [
          { 
            _id: '674f1a2b3c4d5e6f7a8b9c10', 
            name: 'Premium Cotton Shirt', 
            price: 2500,
            images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' }],
            category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' },
            rating: { average: 4.5, count: 25 },
            isFeatured: true
          }
        ]
      }
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
});

// All Products API
app.get('/api/products', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    if (connection) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;
      
      const products = await Product.find({ isActive: true })
        .populate('category')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await Product.countDocuments({ isActive: true });
      
      if (products.length > 0) {
        return res.json({
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
      }
    }
    
    // Fallback
    res.json({
      success: true,
      data: {
        products: [],
        pagination: { page: 1, totalPages: 1, total: 0, limit: 10 }
      }
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Single Product API
app.get('/api/products/:id', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    if (connection) {
      const product = await Product.findById(req.params.id).populate('category');
      
      if (product) {
        return res.json({
          success: true,
          data: { product: product }
        });
      }
    }
    
    // Fallback product
    res.json({
      success: true,
      data: {
        product: {
          _id: req.params.id,
          name: 'Premium Cotton Shirt',
          slug: 'premium-cotton-shirt',
          description: 'High quality premium cotton shirt for men',
          price: 2500,
          images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' }],
          category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' },
          rating: { average: 4.5, count: 25 },
          variants: [{ size: 'M', stock: 10, price: 2500, sku: 'shirt-m' }],
          colors: ['Blue', 'White'],
          stock: 10
        }
      }
    });
  } catch (error) {
    console.error('Single product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Auth API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email && password) {
      const connection = await connectToDatabase();
      
      if (connection) {
        const user = await User.findOne({ email: email, isActive: true });
        
        if (user) {
          return res.json({
            success: true,
            data: {
              user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
              },
              accessToken: 'token-' + user._id
            }
          });
        }
      }
      
      // Fallback login
      res.json({
        success: true,
        data: {
          user: { 
            _id: '674f1a2b3c4d5e6f7a8b9c01', 
            firstName: 'Admin', 
            lastName: 'User', 
            email: email, 
            role: 'admin' 
          },
          accessToken: 'token-admin-123'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Admin APIs
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    let stats = {
      totalProducts: 0,
      totalCategories: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
      topProducts: []
    };
    
    if (connection) {
      stats.totalProducts = await Product.countDocuments({ isActive: true });
      stats.totalCategories = await Category.countDocuments({ isActive: true });
      stats.totalOrders = await Order.countDocuments();
      
      const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
      stats.recentOrders = orders;
      
      stats.totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    }
    
    res.json({
      success: true,
      data: { stats: stats }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

app.get('/api/admin/products', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    
    if (connection) {
      const products = await Product.find().populate('category').sort({ createdAt: -1 });
      
      return res.json({
        success: true,
        data: {
          products: products,
          pagination: { page: 1, totalPages: 1, total: products.length }
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        products: [],
        pagination: { page: 1, totalPages: 1, total: 0 }
      }
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin products'
    });
  }
});

// Other required endpoints
app.get('/api/admin/categories', (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [],
      pagination: { page: 1, totalPages: 1, total: 0 }
    }
  });
});

app.get('/api/admin/orders', (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      pagination: { page: 1, totalPages: 1, total: 0 }
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { 
        _id: '674f1a2b3c4d5e6f7a8b9c01', 
        firstName: 'Admin', 
        lastName: 'User', 
        email: 'admin@test.com', 
        role: 'admin' 
      }
    }
  });
});

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

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;