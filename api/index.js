import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

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

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001', 'https://rawaiti-pehnawa-frontend-gqn2-b8g9zvuzq.vercel.app'];

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

export default app;