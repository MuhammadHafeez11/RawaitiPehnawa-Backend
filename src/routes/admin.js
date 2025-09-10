const express = require('express');
const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const GuestOrder = require('../models/GuestOrder.js');
const User = require('../models/User.js');
const { adminAuth } = require('../middleware/auth.js');

const router = express.Router();

// Dashboard Stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Basic counts
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments();
    const totalOrders = await GuestOrder.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Count unique customers (registered users + unique guest customers)
    const uniqueGuestCustomers = await GuestOrder.distinct('customerDetails.email');
    const totalCustomers = totalUsers + uniqueGuestCustomers.length;

    // Revenue calculations
    const totalRevenue = await GuestOrder.aggregate([
      { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    const monthlyRevenue = await GuestOrder.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    // Order status breakdown
    const ordersByStatus = await GuestOrder.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent orders
    const recentOrders = await GuestOrder.find()
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top selling products
    const topProducts = await GuestOrder.aggregate([
      { $unwind: '$items' },
      { 
        $group: { 
          _id: '$items.productId', 
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({ 
      totalStock: { $lt: 10 }, 
      isActive: true 
    }).limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalUsers,
          totalCustomers,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0
        },
        ordersByStatus,
        recentOrders,
        topProducts,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// Sales Analytics
router.get('/analytics/sales', adminAuth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const salesData = await GuestOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: { salesData }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics',
      error: error.message
    });
  }
});

// Products Management
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', status = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/products', adminAuth, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, data: { product } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Categories Management
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: { categories } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/categories', adminAuth, async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    
    const category = new Category(categoryData);
    await category.save();
    
    res.status(201).json({ success: true, data: { category } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/categories/:id', adminAuth, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    
    res.json({ success: true, data: { category } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/categories/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Orders Management
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await GuestOrder.find()
      .populate('items.productId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: {
        orders: orders,
        pagination: { page: 1, totalPages: 1, total: orders.length }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await GuestOrder.findById(req.params.id)
      .populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await GuestOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Settings Management
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // In production, this would fetch from a Settings model
    const defaultSettings = {
      general: {
        siteName: 'Rawayti Pehnawa',
        siteDescription: 'Premium Pakistani Fashion - Traditional & Contemporary Clothing for Women & Kids',
        contactEmail: 'info@rawayti.pk',
        contactPhone: '+92-321-1234567',
        address: 'Shop No. 15, Fashion Plaza, Gulshan-e-Iqbal, Karachi, Pakistan',
        whatsapp: '+92-321-1234567',
        instagram: '@rawayti_pehnawa',
        facebook: 'RawaytiPehnawa'
      },
      shipping: {
        freeShippingThreshold: 3000,
        standardShippingCost: 150,
        expressShippingCost: 300,
        codAvailable: true,
        deliveryTime: '3-5 business days',
        expressDeliveryTime: '1-2 business days'
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        orderAlerts: true,
        lowStockAlerts: true,
        lowStockThreshold: 5
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 60,
        passwordExpiry: 90
      }
    };
    
    res.json({ success: true, data: defaultSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/settings/:section', adminAuth, async (req, res) => {
  try {
    const { section } = req.params;
    const settingsData = req.body;
    
    // In production, this would save to a Settings model
    // const settings = await Settings.findOneAndUpdate(
    //   { section },
    //   { data: settingsData },
    //   { upsert: true, new: true }
    // );
    
    res.json({ 
      success: true, 
      message: `${section} settings updated successfully`,
      data: settingsData 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;