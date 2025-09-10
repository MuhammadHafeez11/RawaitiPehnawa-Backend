const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/database.js');
const errorHandler = require('./middleware/errorHandler.js');

// Load environment variables first
dotenv.config();

// Production environment check
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 Starting in production mode');
} else {
  console.log('🔧 Starting in development mode');
  // Debug: Check if Cloudinary env vars are loaded in development
  console.log('Environment Variables Check:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'MISSING',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING'
  });
}

// Routes
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const productRoutes = require('./routes/products.js');
const categoryRoutes = require('./routes/categories.js');
const cartRoutes = require('./routes/cart.js');
const orderRoutes = require('./routes/orders.js');
const guestOrderRoutes = require('./routes/guestOrders.js');
const adminRoutes = require('./routes/admin.js');
const uploadRoutes = require('./routes/upload.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (serverless-friendly)
if (process.env.NODE_ENV === 'production') {
  // In serverless, connection should be handled per request
  connectDB().catch(console.error);
} else {
  connectDB();
}

// Simplified rate limiting for serverless
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Professional CORS configuration
app.use(cors({
  origin: [
    'https://rawaiti-pehnawa-frontend.vercel.app',
    'https://ecommerce-frontend-psi-six.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Simplified security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting only in development
if (process.env.NODE_ENV !== 'production') {
  app.use(limiter);
}

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: process.env.NODE_ENV === 'production' ? '5mb' : '10mb'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.NODE_ENV === 'production' ? '5mb' : '10mb'
}));
app.use(cookieParser());

// Trust proxy for production (Vercel)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

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

// Root route for serverless
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rawayti Pehnawa Backend API', 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    routes: [
      '/api/health',
      '/api/products',
      '/api/categories',
      '/api/auth',
      '/api/admin'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Don't use app.listen() in serverless functions
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🌟 Rawayti Pehnawa Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export app for Vercel serverless
module.exports = app;