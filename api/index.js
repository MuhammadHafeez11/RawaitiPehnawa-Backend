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
          images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Premium Cotton Shirt' }],
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          category: { _id: '1', name: 'Men', slug: 'men' },
          featured: true,
          inStock: true,
          slug: 'premium-cotton-shirt',
          description: 'High quality premium cotton shirt for men',
          rating: { average: 4.5, count: 25 },
          variants: [{ size: 'M', stock: 10, price: 2500, sku: 'shirt-m' }],
          colors: ['Blue', 'White'],
          stock: 10
        },
        { 
          _id: '2', 
          name: 'Designer Kurti', 
          price: 1800,
          originalPrice: 2200,
          images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', alt: 'Designer Kurti' }],
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
          category: { _id: '2', name: 'Women', slug: 'women' },
          featured: true,
          inStock: true,
          slug: 'designer-kurti',
          description: 'Beautiful designer kurti for women',
          rating: { average: 4.8, count: 42 },
          variants: [{ size: 'L', stock: 15, price: 1800, sku: 'kurti-l' }],
          colors: ['Pink', 'Red'],
          stock: 15
        },
        { 
          _id: '3', 
          name: 'Casual Jeans', 
          price: 2200,
          originalPrice: 2800,
          images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', alt: 'Casual Jeans' }],
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
          category: { _id: '1', name: 'Men', slug: 'men' },
          featured: true,
          inStock: true,
          slug: 'casual-jeans',
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

// Single Product API
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  
  // Mock single product data
  const product = {
    _id: productId,
    name: 'Premium Cotton Shirt',
    slug: 'premium-cotton-shirt',
    description: 'High quality premium cotton shirt for men with excellent fabric and comfortable fit.',
    shortDescription: 'Premium quality cotton shirt with modern design',
    category: { _id: '1', name: 'Men', slug: 'men' },
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
    currentPrice: 2200,
    discountPercentage: 12,
    hasDiscount: true,
    tags: ['cotton', 'casual', 'men'],
    features: ['100% Cotton', 'Machine Washable', 'Comfortable Fit', 'Breathable Fabric'],
    materials: ['Cotton'],
    careInstructions: 'Machine wash cold, tumble dry low, iron on medium heat',
    isActive: true,
    isFeatured: true,
    isAvailable: true,
    stock: 26,
    totalStock: 26,
    soldCount: 15,
    rating: {
      average: 4.5,
      count: 25
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: {
      product: product
    }
  });
});

// Category products API
app.get('/api/category/:slug', (req, res) => {
  const categorySlug = req.params.slug;
  res.json({
    success: true,
    data: {
      category: { _id: '1', name: 'Men', slug: categorySlug },
      products: [
        { _id: '1', name: 'Premium Cotton Shirt', price: 2500, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', rating: { average: 4.5, count: 25 } }
      ],
      pagination: { page: 1, totalPages: 1, total: 1 }
    }
  });
});

// Collection API
app.get('/api/collection/:slug', (req, res) => {
  const collectionSlug = req.params.slug;
  res.json({
    success: true,
    data: {
      collection: { _id: '1', name: 'New Arrivals', slug: collectionSlug },
      products: [
        { _id: '1', name: 'Premium Cotton Shirt', price: 2500, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', rating: { average: 4.5, count: 25 } }
      ],
      pagination: { page: 1, totalPages: 1, total: 1 }
    }
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { _id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@test.com', role: 'admin' },
      accessToken: 'mock-token-123'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { _id: '2', firstName: 'New', lastName: 'User', email: 'user@test.com', role: 'user' },
      accessToken: 'mock-token-456'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { _id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@test.com', role: 'admin' }
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
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

// Start server for local development
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`✅ Backend is working!`);
  });
}

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
      '/api/products',
      '/api/products/:id',
      '/api/category/:slug',
      '/api/collection/:slug',
      '/api/auth/login',
      '/api/cart'
    ]
  });
});

module.exports = app;