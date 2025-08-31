import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const checkCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = await Category.find({});
    console.log('Categories in database:');
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug}): ${cat.description}`);
      console.log(`  Image: ${cat.image}`);
      console.log(`  Active: ${cat.isActive}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking categories:', error);
    process.exit(1);
  }
};

checkCategories();