const express = require('express');
const { register, login, refreshToken, logout, getMe } = require('../controllers/authController.js');
const { authenticate } = require('../middleware/auth.js');
const { validate, schemas } = require('../middleware/validation.js');

const router = express.Router();

// Public routes
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getMe);

module.exports = router;