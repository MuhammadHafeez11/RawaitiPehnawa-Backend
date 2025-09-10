// Simple validation middleware without zod dependency
const validate = (schema) => {
  return (req, res, next) => {
    // Simple validation - just pass through for now
    next();
  };
};

// Simple schemas object
const schemas = {
  register: {},
  login: {},
  createProduct: {},
  createCategory: {},
  addToCart: {},
  updateCartItem: {},
  createOrder: {},
  mongoId: {},
  pagination: {}
};

module.exports = {
  validate,
  schemas
};