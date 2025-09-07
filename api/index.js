import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from '../src/config/database.js';

// Load environment variables first
dotenv.config();

// Routes
import authRoutes from '../src/routes/auth.js';
import userRoutes from '../src/routes/users.js';
import productRoutes from '../src/routes/products.js';
import categoryRoutes from '../src/routes/categories.js';
import cartRoutes from '../src/routes/cart.js';
import orderRoutes from '../src/routes/orders.js';
import guestOrderRoutes from '../src/routes/guestOrders.js';
import adminRoutes from '../src/routes/admin.js';
import uploadRoutes from '../src/routes/upload.js';
import collectionsRoutes from '../src/routes/collections.js';
import categoriesNewRoutes from '../src/routes/categoriesNew.js';

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'https://rawaiti-pehnawa-frontend.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB
let isConnected = false;
const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
};

// Simple collections route
app.get('/api/collections', (req, res) => {
  res.json({
    success: true,
    data: {
      collections: [
        { _id: '1', name: 'Winter Collection', slug: 'winter-collection', description: 'Warm clothing', isActive: true, productCount: 0 },
        { _id: '2', name: 'Summer Collection', slug: 'summer-collection', description: 'Light clothing', isActive: true, productCount: 0 },
        { _id: '3', name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest trends', isActive: true, productCount: 0 }
      ]
    }
  });
});

// Simple categories-new route
app.get('/api/categories-new', (req, res) => {
  res.json({
    success: true,
    data: {
      categories: [
        { _id: '1', name: 'Women Collection', slug: 'women', description: 'Women clothing', isActive: true, productCount: 0 },
        { _id: '2', name: 'Kids Collection', slug: 'kids', description: 'Kids clothing', isActive: true, productCount: 0 }
      ]
    }
  });
});

// Connect to database before handling requests
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/guest-orders', guestOrderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Rawaiti Pehnawa Backend API'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawaiti Pehnawa Backend API',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Debug middleware to log all requests
app.use('*', (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

export default app;