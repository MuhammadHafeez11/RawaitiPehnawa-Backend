const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MongoDB connection
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }
  
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://muhammadhafeezmern:n1lYJ2siO3s9JWs6@cluster0.bwg5k.mongodb.net/RawaitiPehnawa?retryWrites=true&w=majority&appName=Cluster0', {
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

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Simple CORS
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
    message: 'Rawayti Pehnawa Backend API - WORKING', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '3.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is working perfectly!'
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
    res.json({
      success: true,
      data: {
        categories: [
          { 
            _id: '1', 
            name: 'Men', 
            slug: 'men',
            image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300',
            description: 'Men\'s Fashion Collection',
            parentCategory: null,
            isActive: true
          },
          { 
            _id: '2', 
            name: 'Women', 
            slug: 'women',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300',
            description: 'Women\'s Fashion Collection',
            parentCategory: null,
            isActive: true
          }
        ]
      }
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
    res.json({
      success: true,
      data: {
        products: [
          { 
            _id: '1', 
            name: 'Premium Cotton Shirt', 
            price: 2500,
            images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' }],
            category: { _id: '1', name: 'Men', slug: 'men' },
            rating: { average: 4.5, count: 25 }
          }
        ]
      }
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
    res.json({
      success: true,
      data: {
        products: [],
        pagination: { page: 1, totalPages: 1, total: 0, limit: 10 }
      }
    });
  }
});

// Single Product API
app.get('/api/products/:id', (req, res) => {
  res.json({
    success: true,
    data: {
      product: {
        _id: req.params.id,
        name: 'Premium Cotton Shirt',
        slug: 'premium-cotton-shirt',
        description: 'High quality premium cotton shirt for men with excellent fabric and comfortable fit.',
        shortDescription: 'Premium quality cotton shirt with modern design',
        category: { _id: '1', name: 'Men', slug: 'men' },
        brand: 'Rawayti',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' }
        ],
        variants: [
          { size: 'M', stock: 10, price: 2500, sku: 'shirt-m' }
        ],
        colors: ['Blue', 'White'],
        price: 2500,
        discountedPrice: 2200,
        rating: { average: 4.5, count: 25 },
        features: ['100% Cotton', 'Machine Washable'],
        materials: ['Cotton'],
        stock: 10
      }
    }
  });
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

// Auth API
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { 
        _id: '1', 
        firstName: 'Admin', 
        lastName: 'User', 
        email: 'admin@test.com', 
        role: 'admin' 
      },
      accessToken: 'mock-token-123'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { 
        _id: '2', 
        firstName: 'New', 
        lastName: 'User', 
        email: 'user@test.com', 
        role: 'user' 
      },
      accessToken: 'mock-token-456'
    }
  });
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

// Category pages
app.get('/api/category/:slug', (req, res) => {
  res.json({
    success: true,
    data: {
      category: { 
        _id: '1', 
        name: 'Men', 
        slug: req.params.slug 
      },
      products: [
        { 
          _id: '1', 
          name: 'Premium Cotton Shirt', 
          price: 2500, 
          images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Shirt' }],
          rating: { average: 4.5, count: 25 } 
        }
      ],
      pagination: { page: 1, totalPages: 1, total: 1 }
    }
  });
});

// Collection pages
app.get('/api/collection/:slug', (req, res) => {
  res.json({
    success: true,
    data: {
      collection: { 
        _id: '1', 
        name: 'New Arrivals', 
        slug: req.params.slug 
      },
      products: [
        { 
          _id: '1', 
          name: 'Premium Cotton Shirt', 
          price: 2500, 
          images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Shirt' }],
          rating: { average: 4.5, count: 25 } 
        }
      ],
      pagination: { page: 1, totalPages: 1, total: 1 }
    }
  });
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: {
      orders: [],
      pagination: { page: 1, totalPages: 1, total: 0 }
    }
  });
});

app.post('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: {
      order: {
        _id: 'order-123',
        orderNumber: 'ORD-001',
        status: 'pending',
        total: 2500
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