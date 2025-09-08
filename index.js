// SUPER SIMPLE BACKEND - GUARANTEED WORKING
const express = require('express');
const cors = require('cors');

const app = express();

// CORS - allow everything
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawayti Pehnawa Backend - WORKING', 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [
        { _id: '1', name: 'Men', slug: 'men', image: 'https://via.placeholder.com/300' },
        { _id: '2', name: 'Women', slug: 'women', image: 'https://via.placeholder.com/300' },
        { _id: '3', name: 'Kids', slug: 'kids', image: 'https://via.placeholder.com/300' }
      ]
    }
  });
});

// Featured products
app.get('/api/products/featured', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        { 
          _id: '1', 
          name: 'Premium Shirt', 
          price: 2500, 
          image: 'https://via.placeholder.com/400',
          category: 'Men'
        },
        { 
          _id: '2', 
          name: 'Designer Dress', 
          price: 3500, 
          image: 'https://via.placeholder.com/400',
          category: 'Women'
        }
      ]
    }
  });
});

// All products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        { _id: '1', name: 'Premium Shirt', price: 2500, image: 'https://via.placeholder.com/400' },
        { _id: '2', name: 'Designer Dress', price: 3500, image: 'https://via.placeholder.com/400' },
        { _id: '3', name: 'Kids T-Shirt', price: 1500, image: 'https://via.placeholder.com/400' }
      ],
      pagination: { page: 1, totalPages: 1, total: 3 }
    }
  });
});

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;