import express from 'express';
import GuestOrder from '../models/GuestOrder.js';
import Product from '../models/Product.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Create guest order
router.post('/', async (req, res) => {
  try {
    const { customerDetails, items } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      // Use current price (discounted if available, otherwise regular price)
      const itemPrice = product.discountedPrice && product.discountedPrice < product.price 
        ? product.discountedPrice 
        : product.price;
      
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        variant: {
          size: item.variant?.size || 'One Size',
          color: item.variant?.color || 'Default',
          sku: product.slug
        },
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal
      });

      // Update stock
      product.stock -= item.quantity;
      product.soldCount = (product.soldCount || 0) + item.quantity;
      await product.save();
    }

    const shipping = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + shipping;

    const guestOrder = await GuestOrder.create({
      customerDetails,
      items: orderItems,
      pricing: {
        subtotal,
        shipping,
        total
      }
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderNumber: guestOrder.orderNumber,
        total: guestOrder.pricing.total
      }
    });
  } catch (error) {
    console.error('Guest order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get all guest orders (Admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await GuestOrder.find(filter)
      .populate('items.productId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GuestOrder.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get guest orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get single guest order (Admin only)
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const order = await GuestOrder.findById(req.params.id)
      .populate('items.productId', 'name slug images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get guest order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update guest order status (Admin only)
router.put('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, trackingNumber, carrier, adminNotes } = req.body;

    const updateData = { status };
    
    if (adminNotes) updateData.adminNotes = adminNotes;
    
    if (status === 'shipped' && trackingNumber) {
      updateData.tracking = {
        trackingNumber,
        carrier: carrier || '',
        shippedAt: new Date()
      };
    }
    
    if (status === 'delivered') {
      updateData['tracking.deliveredAt'] = new Date();
    }

    const order = await GuestOrder.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

export default router;