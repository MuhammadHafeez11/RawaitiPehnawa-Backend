const express = require('express');
const cors = require('cors');

const app = express();

// CORS - allow your frontend
app.use(cors({
  origin: [
    'https://rawaiti-pehnawa-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawayti Pehnawa Backend API - WORKING', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0'
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

// Categories API
app.get('/api/categories', (req, res) => {
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
        },
        { 
          _id: '3', 
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
          _id: '1', 
          name: 'Premium Cotton Shirt', 
          price: 2500,
          originalPrice: 3000,
          images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          category: { _id: '1', name: 'Men', slug: 'men' },
          featured: true,
          inStock: true,
          slug: 'premium-cotton-shirt',
          description: 'High quality premium cotton shirt for men'
        },
        { 
          _id: '2', 
          name: 'Designer Kurti', 
          price: 1800,
          originalPrice: 2200,
          images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'],
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          category: { _id: '2', name: 'Women', slug: 'women' },
          featured: true,
          inStock: true,
          slug: 'designer-kurti',
          description: 'Beautiful designer kurti for women'
        },
        { 
          _id: '3', 
          name: 'Casual Jeans', 
          price: 2200,
          originalPrice: 2800,
          images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
          category: { _id: '1', name: 'Men', slug: 'men' },
          featured: true,
          inStock: true,
          slug: 'casual-jeans',
          description: 'Comfortable casual jeans for everyday wear'
        }
      ]
    }
  });
});

// All Products API
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        { _id: '1', name: 'Premium Cotton Shirt', price: 2500, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
        { _id: '2', name: 'Designer Kurti', price: 1800, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400' },
        { _id: '3', name: 'Casual Jeans', price: 2200, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
        { _id: '4', name: 'Kids T-Shirt', price: 800, image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400' }
      ],
      pagination: { 
        page: 1, 
        totalPages: 1, 
        total: 4,
        limit: 10
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
        items: [],
        totalItems: 0,
        totalAmount: 0,
        count: 0
      }
    }
  });
});

app.put('/api/cart/items/:id', (req, res) => {
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

app.delete('/api/cart/items/:id', (req, res) => {
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

// Catch all other routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    availableRoutes: [
      '/',
      '/api/health',
      '/api/categories',
      '/api/products/featured',
      '/api/products'
    ]
  });
});

module.exports = app;