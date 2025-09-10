const express = require('express');
const cors = require('cors');

const app = express();

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
    version: '4.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend working!'
  });
});

// Categories API - Working data
app.get('/api/categories', (req, res) => {
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
          parentCategory: null,
          isActive: true
        },
        { 
          _id: '674f1a2b3c4d5e6f7a8b9c0e', 
          name: 'Women', 
          slug: 'women',
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300',
          description: 'Women\'s Fashion Collection',
          parentCategory: null,
          isActive: true
        },
        { 
          _id: '674f1a2b3c4d5e6f7a8b9c0f', 
          name: 'Kids', 
          slug: 'kids',
          image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=300',
          description: 'Kids Fashion Collection',
          parentCategory: null,
          isActive: true
        }
      ]
    }
  });
});

// Featured Products API
app.get('/api/products/featured', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        { 
          _id: '674f1a2b3c4d5e6f7a8b9c10', 
          name: 'Premium Cotton Shirt', 
          slug: 'premium-cotton-shirt',
          price: 2500,
          discountedPrice: 2200,
          images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' }],
          category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' },
          isFeatured: true,
          isActive: true,
          description: 'High quality premium cotton shirt for men',
          rating: { average: 4.5, count: 25 },
          variants: [{ size: 'M', stock: 10, price: 2500, sku: 'shirt-m' }],
          colors: ['Blue', 'White'],
          stock: 10
        },
        { 
          _id: '674f1a2b3c4d5e6f7a8b9c11', 
          name: 'Designer Kurti', 
          slug: 'designer-kurti',
          price: 1800,
          discountedPrice: 1600,
          images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', alt: 'Designer Kurti' }],
          category: { _id: '674f1a2b3c4d5e6f7a8b9c0e', name: 'Women', slug: 'women' },
          isFeatured: true,
          isActive: true,
          description: 'Beautiful designer kurti for women',
          rating: { average: 4.8, count: 42 },
          variants: [{ size: 'L', stock: 15, price: 1800, sku: 'kurti-l' }],
          colors: ['Pink', 'Red'],
          stock: 15
        },
        { 
          _id: '674f1a2b3c4d5e6f7a8b9c12', 
          name: 'Casual Jeans', 
          slug: 'casual-jeans',
          price: 2200,
          discountedPrice: 1980,
          images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', alt: 'Casual Jeans' }],
          category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' },
          isFeatured: true,
          isActive: true,
          description: 'Comfortable casual jeans for everyday wear',
          rating: { average: 4.2, count: 18 },
          variants: [{ size: '32', stock: 8, price: 2200, sku: 'jeans-32' }],
          colors: ['Blue', 'Black'],
          stock: 8
        }
      ]
    }
  });
});

// All Products API
app.get('/api/products', (req, res) => {
  const products = [
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c10', 
      name: 'Premium Cotton Shirt', 
      slug: 'premium-cotton-shirt',
      price: 2500, 
      discountedPrice: 2200,
      images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' }],
      category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' },
      rating: { average: 4.5, count: 25 },
      isActive: true
    },
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c11', 
      name: 'Designer Kurti', 
      slug: 'designer-kurti',
      price: 1800, 
      discountedPrice: 1600,
      images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', alt: 'Designer Kurti' }],
      category: { _id: '674f1a2b3c4d5e6f7a8b9c0e', name: 'Women', slug: 'women' },
      rating: { average: 4.8, count: 42 },
      isActive: true
    },
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c12', 
      name: 'Casual Jeans', 
      slug: 'casual-jeans',
      price: 2200, 
      discountedPrice: 1980,
      images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', alt: 'Casual Jeans' }],
      category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' },
      rating: { average: 4.2, count: 18 },
      isActive: true
    }
  ];

  res.json({
    success: true,
    data: {
      products: products,
      pagination: { 
        page: 1, 
        totalPages: 1, 
        total: products.length,
        limit: 10
      }
    }
  });
});

// Single Product API - WORKING
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  
  const product = {
    _id: productId,
    name: 'Premium Cotton Shirt',
    slug: 'premium-cotton-shirt',
    description: 'High quality premium cotton shirt for men with excellent fabric and comfortable fit. Perfect for both casual and formal occasions.',
    shortDescription: 'Premium quality cotton shirt with modern design',
    category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' },
    brand: 'Rawayti',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' },
      { url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400', alt: 'Premium Cotton Shirt Back' }
    ],
    variants: [
      { size: 'S', stock: 5, price: 2500, sku: 'shirt-s' },
      { size: 'M', stock: 10, price: 2500, sku: 'shirt-m' },
      { size: 'L', stock: 8, price: 2500, sku: 'shirt-l' },
      { size: 'XL', stock: 3, price: 2500, sku: 'shirt-xl' }
    ],
    colors: ['Blue', 'White', 'Black'],
    price: 2500,
    discountedPrice: 2200,
    rating: { average: 4.5, count: 25 },
    features: ['100% Cotton', 'Machine Washable', 'Comfortable Fit', 'Breathable Fabric'],
    materials: ['Cotton'],
    careInstructions: 'Machine wash cold, tumble dry low, iron on medium heat',
    stock: 26,
    isActive: true,
    isFeatured: true
  };
  
  res.json({
    success: true,
    data: {
      product: product
    }
  });
});

// Category products - WORKING
app.get('/api/category/:slug', (req, res) => {
  const categorySlug = req.params.slug;
  
  const products = [
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c10', 
      name: 'Premium Cotton Shirt', 
      price: 2500, 
      images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Shirt' }],
      rating: { average: 4.5, count: 25 },
      category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' }
    },
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c12', 
      name: 'Casual Jeans', 
      price: 2200, 
      images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', alt: 'Jeans' }],
      rating: { average: 4.2, count: 18 },
      category: { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men' }
    }
  ];

  res.json({
    success: true,
    data: {
      category: { 
        _id: '674f1a2b3c4d5e6f7a8b9c0d', 
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1), 
        slug: categorySlug 
      },
      products: products,
      pagination: { page: 1, totalPages: 1, total: products.length }
    }
  });
});

// Collection pages - WORKING
app.get('/api/collection/:slug', (req, res) => {
  const collectionSlug = req.params.slug;
  
  const products = [
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c10', 
      name: 'Premium Cotton Shirt', 
      price: 2500, 
      images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Shirt' }],
      rating: { average: 4.5, count: 25 } 
    }
  ];

  res.json({
    success: true,
    data: {
      collection: { 
        _id: '1', 
        name: collectionSlug === 'new-arrivals' ? 'New Arrivals' : 'Sale', 
        slug: collectionSlug 
      },
      products: products,
      pagination: { page: 1, totalPages: 1, total: products.length }
    }
  });
});

// Auth API - WORKING
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple working login
  if (email && password) {
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
        accessToken: 'mock-token-123'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password required'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (firstName && lastName && email && password) {
    res.json({
      success: true,
      data: {
        user: { 
          _id: '674f1a2b3c4d5e6f7a8b9c02', 
          firstName: firstName, 
          lastName: lastName, 
          email: email, 
          role: 'user' 
        },
        accessToken: 'mock-token-456'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'All fields required'
    });
  }
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

app.post('/api/auth/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
});

// Admin API - WORKING
app.get('/api/admin/products', (req, res) => {
  const products = [
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c10', 
      name: 'Premium Cotton Shirt', 
      price: 2500,
      category: { name: 'Men' },
      stock: 26,
      isActive: true
    },
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c11', 
      name: 'Designer Kurti', 
      price: 1800,
      category: { name: 'Women' },
      stock: 15,
      isActive: true
    }
  ];

  res.json({
    success: true,
    data: {
      products: products,
      pagination: { page: 1, totalPages: 1, total: products.length }
    }
  });
});

app.get('/api/admin/categories', (req, res) => {
  const categories = [
    { _id: '674f1a2b3c4d5e6f7a8b9c0d', name: 'Men', slug: 'men', isActive: true },
    { _id: '674f1a2b3c4d5e6f7a8b9c0e', name: 'Women', slug: 'women', isActive: true },
    { _id: '674f1a2b3c4d5e6f7a8b9c0f', name: 'Kids', slug: 'kids', isActive: true }
  ];

  res.json({
    success: true,
    data: {
      categories: categories,
      pagination: { page: 1, totalPages: 1, total: categories.length }
    }
  });
});

app.get('/api/admin/orders', (req, res) => {
  const orders = [
    { 
      _id: '674f1a2b3c4d5e6f7a8b9c20', 
      orderNumber: 'ORD-001', 
      total: 2500, 
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: {
      orders: orders,
      pagination: { page: 1, totalPages: 1, total: orders.length }
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
        _id: 'order-' + Date.now(),
        orderNumber: 'ORD-' + Date.now(),
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