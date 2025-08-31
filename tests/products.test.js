import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';

const MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/ecommerce_test';

let adminToken;
let testCategory;

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  // Create admin user and get token
  const adminUser = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'password123'
    });

  adminToken = loginResponse.body.data.accessToken;

  // Create test category
  testCategory = await Category.create({
    name: 'Test Category',
    description: 'Test category description'
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product Endpoints', () => {
  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create test products
      await Product.create([
        {
          name: 'Test Product 1',
          description: 'Test product 1 description',
          category: testCategory._id,
          basePrice: 29.99,
          variants: [
            { size: 'S', color: 'Red', colorCode: '#FF0000', stock: 10, price: 29.99, sku: 'TP1-S-RED' }
          ]
        },
        {
          name: 'Test Product 2',
          description: 'Test product 2 description',
          category: testCategory._id,
          basePrice: 39.99,
          variants: [
            { size: 'M', color: 'Blue', colorCode: '#0000FF', stock: 15, price: 39.99, sku: 'TP2-M-BLUE' }
          ]
        }
      ]);
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get(`/api/products?category=${testCategory._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
    });

    it('should paginate products', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });
  });

  describe('POST /api/products', () => {
    it('should create product with admin token', async () => {
      const productData = {
        name: 'New Test Product',
        description: 'New test product description',
        category: testCategory._id.toString(),
        basePrice: 49.99,
        variants: [
          { size: 'L', color: 'Green', colorCode: '#008000', stock: 20, price: 49.99, sku: 'NTP-L-GREEN' }
        ]
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.name).toBe(productData.name);
    });

    it('should not create product without admin token', async () => {
      const productData = {
        name: 'New Test Product',
        description: 'New test product description',
        category: testCategory._id.toString(),
        basePrice: 49.99,
        variants: [
          { size: 'L', color: 'Green', colorCode: '#008000', stock: 20, price: 49.99, sku: 'NTP-L-GREEN' }
        ]
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create product with invalid data', async () => {
      const productData = {
        name: '', // Invalid: empty name
        description: 'Test description',
        category: testCategory._id.toString(),
        basePrice: -10, // Invalid: negative price
        variants: []
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products/:id', () => {
    let testProduct;

    beforeEach(async () => {
      testProduct = await Product.create({
        name: 'Single Test Product',
        description: 'Single test product description',
        category: testCategory._id,
        basePrice: 59.99,
        variants: [
          { size: 'XL', color: 'Black', colorCode: '#000000', stock: 5, price: 59.99, sku: 'STP-XL-BLACK' }
        ]
      });
    });

    it('should get single product by ID', async () => {
      const response = await request(app)
        .get(`/api/products/${testProduct._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.name).toBe(testProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});