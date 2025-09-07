import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

async function cleanOldData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove old products and categories
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('✅ Old products and categories removed');
    console.log('✅ Database ready for new structure');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanOldData();