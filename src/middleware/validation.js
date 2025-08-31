import { z } from 'zod';

/**
 * Validation middleware factory
 * @param {Object} schema - Zod schema object with body, params, query
 * @returns {Function} Express middleware
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errorMessages
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  register: {
    body: z.object({
      firstName: z.string().min(1, 'First name is required').max(50),
      lastName: z.string().min(1, 'Last name is required').max(50),
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 characters')
    })
  },

  login: {
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(1, 'Password is required')
    })
  },

  // Product schemas
  createProduct: {
    body: z.object({
      name: z.string().min(1, 'Product name is required').max(200),
      description: z.string().min(1, 'Description is required').max(2000),
      shortDescription: z.string().max(500).optional(),
      category: z.string().min(1, 'Category is required'),
      brand: z.string().max(50).optional(),
      price: z.number().min(0, 'Price must be positive'),
      discountedPrice: z.number().min(0).optional(),
      tags: z.array(z.string()).optional(),
      features: z.array(z.string()).optional(),
      materials: z.array(z.string()).optional(),
      careInstructions: z.string().max(1000).optional(),
      stock: z.number().min(0).optional(),
      variants: z.array(z.object({
        size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', '2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16']).optional(),
        color: z.string().optional(),
        colorCode: z.string().optional(),
        stock: z.number().min(0).optional(),
        price: z.number().min(0).optional(),
        sku: z.string().optional()
      })).optional(),
      images: z.array(z.object({
        url: z.string(),
        alt: z.string().optional(),
        publicId: z.string().optional()
      })).optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional()
    })
  },

  // Category schemas
  createCategory: {
    body: z.object({
      name: z.string().min(1, 'Category name is required').max(50),
      description: z.string().max(500).optional(),
      parentCategory: z.string().optional()
    })
  },

  // Cart schemas
  addToCart: {
    body: z.object({
      productId: z.string().min(1, 'Product ID is required'),
      variant: z.object({
        size: z.string().min(1, 'Size is required'),
        color: z.string().min(1, 'Color is required'),
        price: z.number().min(0, 'Price must be positive')
      }),
      quantity: z.number().min(1, 'Quantity must be at least 1').default(1)
    })
  },

  updateCartItem: {
    body: z.object({
      quantity: z.number().min(1, 'Quantity must be at least 1')
    })
  },

  // Order schemas
  createOrder: {
    body: z.object({
      shippingAddress: z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email format'),
        phone: z.string().min(1, 'Phone is required'),
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zipCode: z.string().min(1, 'ZIP code is required'),
        country: z.string().default('US')
      }),
      paymentMethod: z.enum(['stripe', 'paypal', 'cash_on_delivery']).default('stripe')
    })
  },

  // Common parameter schemas
  mongoId: {
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
    })
  },

  pagination: {
    query: z.object({
      page: z.string().regex(/^\d+$/).transform(Number).default('1'),
      limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
      sort: z.string().optional(),
      search: z.string().optional()
    })
  }
};