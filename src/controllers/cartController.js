import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Get user's cart
 * @route GET /api/cart
 */
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images slug basePrice salePrice');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add item to cart
 * @route POST /api/cart/items
 */
export const addToCart = async (req, res, next) => {
  try {
    const { productId, variant, quantity } = req.body;

    // Verify product exists and get variant details
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find the specific variant
    const productVariant = product.variants.find(v => 
      v.size === variant.size && v.color === variant.color
    );

    if (!productVariant) {
      return res.status(400).json({
        success: false,
        message: 'Product variant not found'
      });
    }

    // Check stock availability
    if (productVariant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add item to cart
    await cart.addItem(productId, {
      size: variant.size,
      color: variant.color,
      price: productVariant.price
    }, quantity);

    // Populate and return updated cart
    await cart.populate('items.product', 'name images slug basePrice salePrice');

    res.json({
      success: true,
      message: 'Item added to cart',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 * @route PUT /api/cart/items/:itemId
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the cart item
    const cartItem = cart.items.find(item => item._id.toString() === itemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Verify stock availability
    const product = await Product.findById(cartItem.product);
    const productVariant = product.variants.find(v => 
      v.size === cartItem.variant.size && v.color === cartItem.variant.color
    );

    if (productVariant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Update quantity
    await cart.updateItemQuantity(itemId, quantity);
    await cart.populate('items.product', 'name images slug basePrice salePrice');

    res.json({
      success: true,
      message: 'Cart item updated',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 * @route DELETE /api/cart/items/:itemId
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.removeItem(itemId);
    await cart.populate('items.product', 'name images slug basePrice salePrice');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear entire cart
 * @route DELETE /api/cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};