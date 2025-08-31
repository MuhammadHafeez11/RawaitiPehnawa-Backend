import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testProduct = {
  name: 'Test Product',
  description: 'Test Description',
  category: '507f1f77bcf86cd799439011', // dummy ObjectId
  price: 1000,
  discountedPrice: 800,
  variants: []
};

const testProductCreation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Import Product model
    const Product = (await import('./src/models/Product.js')).default;
    
    console.log('Testing product creation...');
    console.log('Product data:', testProduct);
    
    const product = new Product(testProduct);
    await product.validate();
    
    console.log('✅ Product validation passed!');
    console.log('Product can be created without basePrice or required variants');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

testProductCreation();