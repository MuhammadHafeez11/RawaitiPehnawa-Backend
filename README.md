# Ecommerce Backend API

A comprehensive MERN stack ecommerce backend API for women & kids clothing store.

## Features

- **Authentication & Authorization**: JWT-based auth with access/refresh tokens
- **Product Management**: CRUD operations with variants, categories, and inventory
- **Shopping Cart**: Add, update, remove items with stock validation
- **Order Management**: Complete order processing with Stripe integration
- **Image Upload**: Cloudinary integration for product images
- **Admin Panel**: Admin-only routes for product and order management
- **Security**: Rate limiting, input validation, error handling
- **Testing**: Jest unit tests for core functionality

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod schema validation
- **File Upload**: Multer + Cloudinary
- **Payments**: Stripe (test mode)
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, Rate limiting

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account (test mode)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key-here
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Seed Database**
   ```bash
   npm run seed
   ```
   This creates:
   - Admin user: `admin@site.com` / `Admin@123`
   - Sample categories (Women, Kids with subcategories)
   - 30 sample products with variants

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all products (with filtering/pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Upload
- `POST /api/upload/image` - Upload single image (Admin)
- `POST /api/upload/images` - Upload multiple images (Admin)
- `DELETE /api/upload/image/:publicId` - Delete image (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id/role` - Update user role (Admin)

## Authentication Flow

### Token Storage
- **Access Token**: Stored in memory (frontend), expires in 15 minutes
- **Refresh Token**: Stored as httpOnly cookie, expires in 7 days
- **Security**: Refresh tokens are stored in database and validated on each refresh

### Token Refresh Process
1. Frontend makes API request with access token
2. If access token expired (401), frontend calls `/api/auth/refresh`
3. Backend validates refresh token from cookie
4. If valid, returns new access token
5. Frontend retries original request with new token

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test auth.test.js
```

## Postman Collection

Import `postman_collection.json` into Postman for easy API testing.

**Quick Test Flow:**
1. Login with admin credentials: `admin@site.com` / `Admin@123`
2. Copy access token from response
3. Set `accessToken` variable in Postman
4. Test protected endpoints

## Database Schema

### User Model
- Authentication fields (email, password, role)
- Profile information (name, phone, address)
- Refresh token storage

### Product Model
- Basic info (name, description, category, brand)
- Pricing (base price, sale price)
- Variants (size, color, stock, SKU)
- Images and metadata
- Search indexing

### Order Model
- User reference and order items
- Shipping address and payment info
- Order status tracking
- Stripe payment integration

### Cart Model
- User-specific cart items
- Automatic total calculations
- Stock validation methods

## Error Handling

- **Validation Errors**: Zod schema validation with detailed error messages
- **Authentication Errors**: JWT token validation and refresh logic
- **Database Errors**: Mongoose validation and duplicate key handling
- **Global Handler**: Centralized error processing with appropriate HTTP status codes

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Zod schemas for all endpoints
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Separate secrets for access/refresh tokens
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Cookie Security**: httpOnly, secure, sameSite settings

## Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- Use MongoDB Atlas for database
- Use production Stripe keys
- Set secure JWT secrets
- Configure Cloudinary for production

### Recommended Platforms
- **Backend**: Render, Heroku, DigitalOcean App Platform
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Monitoring**: Consider adding logging service

### Performance Considerations
- Database indexing for search and filtering
- Image optimization through Cloudinary
- Caching strategies for frequently accessed data
- Connection pooling for database

## Development Notes

### Code Structure
- **Controllers**: Business logic and request handling
- **Models**: Database schemas and methods
- **Middleware**: Authentication, validation, error handling
- **Routes**: API endpoint definitions
- **Utils**: Helper functions and configurations

### Best Practices Implemented
- RESTful API design
- Consistent error responses
- Input validation and sanitization
- Proper HTTP status codes
- Comprehensive logging
- Modular code organization

## Support

For issues or questions:
1. Check the API documentation above
2. Review the Postman collection for examples
3. Check test files for usage patterns
4. Ensure all environment variables are properly configured