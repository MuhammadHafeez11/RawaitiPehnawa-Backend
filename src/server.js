import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import { corsMiddleware } from './middleware/cors.js';

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
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import guestOrderRoutes from './routes/guestOrders.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (serverless-friendly)
if (process.env.NODE_ENV === 'production') {
  // In serverless, connection should be handled per request
  connectDB().catch(console.error);
} else {
  connectDB();
}

// Rate limiting - production optimized
const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 1 * 60 * 1000, // 15 min in prod, 1 min in dev
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 requests per 15min in prod, 1000 per min in dev
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: process.env.NODE_ENV === 'production' ? 900 : 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

// Custom CORS middleware first
app.use(corsMiddleware);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// Apply rate limiting
app.use(limiter);

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

export default app;