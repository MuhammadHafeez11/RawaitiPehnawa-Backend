import mongoose from 'mongoose';
import Category from '../models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const oldCategories = [
  {
    name: 'Women',
    slug: 'women',
    description: 'Women\'s clothing and accessories',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Kids',
    slug: 'kids', 
    description: 'Kids clothing for boys and girls',
    isActive: true,
    sortOrder: 2
  }
];

async function seedOldCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    const categories = await Category.insertMany(oldCategories);
    
    console.log(`✅ Created ${categories.length} old categories for frontend`);
    categories.forEach(cat => console.log(`- ${cat.name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Old category seeding failed:', error);
    process.exit(1);
  }
}

seedOldCategories();