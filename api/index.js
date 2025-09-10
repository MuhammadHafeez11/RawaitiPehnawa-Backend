const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('../src/config/database.js');

// Load environment variables first
dotenv.config();

// Routes
const authRoutes = require('../src/routes/auth.js');
const userRoutes = require('../src/routes/users.js');
const productRoutes = require('../src/routes/products.js');
const categoryRoutes = require('../src/routes/categories.js');
const cartRoutes = require('../src/routes/cart.js');
const orderRoutes = require('../src/routes/orders.js');
const guestOrderRoutes = require('../src/routes/guestOrders.js');
const adminRoutes = require('../src/routes/admin.js');
const uploadRoutes = require('../src/routes/upload.js');

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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;