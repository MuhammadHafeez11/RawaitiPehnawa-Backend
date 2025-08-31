import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create new order
 * @route POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'stripe' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify stock and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      const variant = product.variants.find(v => 
        v.size === cartItem.variant.size && v.color === cartItem.variant.color
      );

      if (!variant || variant.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} (${cartItem.variant.size}, ${cartItem.variant.color})`
        });
      }

      const itemTotal = cartItem.variant.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        variant: {
          size: cartItem.variant.size,
          color: cartItem.variant.color,
          sku: variant.sku
        },
        quantity: cartItem.quantity,
        price: cartItem.variant.price,
        total: itemTotal
      });
    }

    // Calculate totals (simplified - no tax/shipping for MVP)
    const tax = 0;
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod
      },
      pricing: {
        subtotal,
        tax,
        shipping,
        total
      }
    });

    // Create Stripe payment intent if using Stripe
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString()
        }
      });

      order.paymentInfo.stripePaymentIntentId = paymentIntent.id;
      await order.save();
    }

    // Update product stock
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product._id);
      const variantIndex = product.variants.findIndex(v => 
        v.size === cartItem.variant.size && v.color === cartItem.variant.color
      );
      
      if (variantIndex !== -1) {
        product.variants[variantIndex].stock -= cartItem.quantity;
        product.soldCount += cartItem.quantity;
        await product.save();
      }
    }

    // Clear cart
    await cart.clearCart();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { 
        order,
        clientSecret: paymentMethod === 'stripe' ? order.paymentInfo.stripePaymentIntentId : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's orders
 * @route GET /api/orders
 */
export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single order
 * @route GET /api/orders/:id
 */
export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user._id
    }).populate('items.product', 'name slug');

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
    next(error);
  }
};

/**
 * Get all orders (Admin only)
 * @route GET /api/orders/admin/all
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status (Admin only)
 * @route PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = status;

    if (status === 'shipped' && trackingNumber) {
      order.tracking.trackingNumber = trackingNumber;
      order.tracking.carrier = carrier;
      order.tracking.shippedAt = new Date();
    }

    if (status === 'delivered') {
      order.tracking.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};