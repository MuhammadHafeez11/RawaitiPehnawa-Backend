// MINIMAL SERVERLESS BACKEND - GUARANTEED TO WORK
import express from 'express';
import cors from 'cors';

const app = express();

// CORS - allow everything
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: false
}));

app.use(express.json());

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawayti Pehnawa Backend API - WORKING', 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock categories for testing
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [
        { _id: '1', name: 'Men', slug: 'men' },
        { _id: '2', name: 'Women', slug: 'women' },
        { _id: '3', name: 'Kids', slug: 'kids' }
      ]
    }
  });
});

// Mock products for testing
app.get('/api/products/featured', (req, res) => {
  res.json({
    success: true,
    data: {
      products: [
        { _id: '1', name: 'Test Product 1', price: 1000 },
        { _id: '2', name: 'Test Product 2', price: 2000 }
      ]
    }
  });
});

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;