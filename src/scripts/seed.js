import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@site.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('Created admin user');

    // Create categories
    const womenCategory = await Category.create({
      name: 'Women',
      description: 'Women\'s clothing and accessories',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400'
    });

    const kidsCategory = await Category.create({
      name: 'Kids',
      description: 'Children\'s clothing and accessories',
      image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400'
    });

    // Create subcategories
    const womenTops = await Category.create({
      name: 'Tops',
      description: 'Women\'s tops and blouses',
      parentCategory: womenCategory._id
    });

    const womenDresses = await Category.create({
      name: 'Dresses',
      description: 'Women\'s dresses',
      parentCategory: womenCategory._id
    });

    const kidsGirls = await Category.create({
      name: 'Girls',
      description: 'Girls clothing',
      parentCategory: kidsCategory._id
    });

    const kidsBoys = await Category.create({
      name: 'Boys',
      description: 'Boys clothing',
      parentCategory: kidsCategory._id
    });

    console.log('Created categories');

    // Sample products data
    const products = [
      // Women's Products
      {
        name: 'Floral Summer Dress',
        description: 'Beautiful floral print summer dress perfect for warm weather. Made from lightweight, breathable fabric.',
        shortDescription: 'Lightweight floral summer dress',
        category: womenDresses._id,
        brand: 'SummerStyle',
        price: 7999,
        discountedPrice: 5999,
        images: [
          { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', alt: 'Floral Summer Dress' }
        ],
        variants: [
          { size: 'S', color: 'Pink', colorCode: '#FFC0CB', stock: 15, price: 5999, sku: 'FSD-S-PINK' },
          { size: 'M', color: 'Pink', colorCode: '#FFC0CB', stock: 20, price: 5999, sku: 'FSD-M-PINK' },
          { size: 'L', color: 'Blue', colorCode: '#87CEEB', stock: 12, price: 5999, sku: 'FSD-L-BLUE' }
        ],
        tags: ['summer', 'floral', 'casual'],
        features: ['Lightweight fabric', 'Floral print', 'Knee-length'],
        materials: ['100% Cotton'],
        careInstructions: 'Machine wash cold, hang dry',
        isFeatured: true
      },
      {
        name: 'Classic White Blouse',
        description: 'Timeless white blouse suitable for office or casual wear. Features button-down front and classic collar.',
        shortDescription: 'Classic button-down white blouse',
        category: womenTops._id,
        brand: 'ClassicWear',
        price: 4999,
        images: [
          { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', alt: 'White Blouse' }
        ],
        variants: [
          { size: 'XS', color: 'White', colorCode: '#FFFFFF', stock: 8, price: 4999, sku: 'CWB-XS-WHITE' },
          { size: 'S', color: 'White', colorCode: '#FFFFFF', stock: 15, price: 4999, sku: 'CWB-S-WHITE' },
          { size: 'M', color: 'White', colorCode: '#FFFFFF', stock: 18, price: 4999, sku: 'CWB-M-WHITE' },
          { size: 'L', color: 'White', colorCode: '#FFFFFF', stock: 12, price: 4999, sku: 'CWB-L-WHITE' }
        ],
        tags: ['classic', 'office', 'versatile'],
        features: ['Button-down front', 'Classic collar', 'Long sleeves'],
        materials: ['Cotton blend'],
        careInstructions: 'Machine wash warm, iron if needed'
      },
      {
        name: 'Denim Jacket',
        description: 'Classic denim jacket that never goes out of style. Perfect layering piece for any season.',
        shortDescription: 'Classic denim jacket',
        category: womenTops._id,
        brand: 'DenimCo',
        basePrice: 89.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800', alt: 'Denim Jacket' }
        ],
        variants: [
          { size: 'S', color: 'Blue', colorCode: '#4169E1', stock: 10, price: 89.99, sku: 'DJ-S-BLUE' },
          { size: 'M', color: 'Blue', colorCode: '#4169E1', stock: 15, price: 89.99, sku: 'DJ-M-BLUE' },
          { size: 'L', color: 'Blue', colorCode: '#4169E1', stock: 8, price: 89.99, sku: 'DJ-L-BLUE' }
        ],
        tags: ['denim', 'classic', 'layering'],
        features: ['Classic fit', 'Button closure', 'Chest pockets'],
        materials: ['100% Cotton Denim'],
        careInstructions: 'Machine wash cold, tumble dry low',
        isFeatured: true
      },
      {
        name: 'Striped T-Shirt',
        description: 'Comfortable striped t-shirt perfect for casual everyday wear. Soft cotton blend fabric.',
        shortDescription: 'Casual striped t-shirt',
        category: womenTops._id,
        brand: 'CasualWear',
        basePrice: 24.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', alt: 'Striped T-Shirt' }
        ],
        variants: [
          { size: 'XS', color: 'Navy/White', colorCode: '#000080', stock: 12, price: 24.99, sku: 'ST-XS-NAVY' },
          { size: 'S', color: 'Navy/White', colorCode: '#000080', stock: 20, price: 24.99, sku: 'ST-S-NAVY' },
          { size: 'M', color: 'Navy/White', colorCode: '#000080', stock: 25, price: 24.99, sku: 'ST-M-NAVY' },
          { size: 'L', color: 'Red/White', colorCode: '#FF0000', stock: 15, price: 24.99, sku: 'ST-L-RED' }
        ],
        tags: ['casual', 'stripes', 'everyday'],
        features: ['Soft cotton blend', 'Classic stripes', 'Comfortable fit'],
        materials: ['60% Cotton, 40% Polyester'],
        careInstructions: 'Machine wash cold, tumble dry low'
      },
      {
        name: 'Maxi Dress',
        description: 'Elegant maxi dress perfect for special occasions or evening wear. Flowing silhouette with beautiful draping.',
        shortDescription: 'Elegant flowing maxi dress',
        category: womenDresses._id,
        brand: 'ElegantWear',
        basePrice: 129.99,
        salePrice: 99.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=800', alt: 'Maxi Dress' }
        ],
        variants: [
          { size: 'S', color: 'Black', colorCode: '#000000', stock: 8, price: 99.99, sku: 'MD-S-BLACK' },
          { size: 'M', color: 'Black', colorCode: '#000000', stock: 12, price: 99.99, sku: 'MD-M-BLACK' },
          { size: 'L', color: 'Navy', colorCode: '#000080', stock: 10, price: 99.99, sku: 'MD-L-NAVY' }
        ],
        tags: ['elegant', 'evening', 'formal'],
        features: ['Floor-length', 'Flowing silhouette', 'Sleeveless'],
        materials: ['Polyester blend'],
        careInstructions: 'Dry clean recommended',
        isFeatured: true
      },
      // Kids Products
      {
        name: 'Rainbow Unicorn T-Shirt',
        description: 'Fun and colorful unicorn t-shirt that kids will love. Soft cotton fabric with sparkly unicorn design.',
        shortDescription: 'Colorful unicorn t-shirt for kids',
        category: kidsGirls._id,
        brand: 'KidsFun',
        basePrice: 19.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800', alt: 'Unicorn T-Shirt' }
        ],
        variants: [
          { size: '2T', color: 'Pink', colorCode: '#FFC0CB', stock: 15, price: 19.99, sku: 'RUT-2T-PINK' },
          { size: '3T', color: 'Pink', colorCode: '#FFC0CB', stock: 18, price: 19.99, sku: 'RUT-3T-PINK' },
          { size: '4T', color: 'Purple', colorCode: '#800080', stock: 12, price: 19.99, sku: 'RUT-4T-PURPLE' },
          { size: '5T', color: 'Purple', colorCode: '#800080', stock: 10, price: 19.99, sku: 'RUT-5T-PURPLE' }
        ],
        tags: ['kids', 'unicorn', 'fun', 'colorful'],
        features: ['Sparkly design', 'Soft cotton', 'Machine washable'],
        materials: ['100% Cotton'],
        careInstructions: 'Machine wash cold, tumble dry low'
      },
      {
        name: 'Dinosaur Adventure Shirt',
        description: 'Exciting dinosaur-themed shirt perfect for little adventurers. Features colorful dinosaur prints.',
        shortDescription: 'Fun dinosaur shirt for boys',
        category: kidsBoys._id,
        brand: 'AdventureKids',
        basePrice: 22.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800', alt: 'Dinosaur Shirt' }
        ],
        variants: [
          { size: '2T', color: 'Green', colorCode: '#008000', stock: 12, price: 22.99, sku: 'DAS-2T-GREEN' },
          { size: '3T', color: 'Green', colorCode: '#008000', stock: 15, price: 22.99, sku: 'DAS-3T-GREEN' },
          { size: '4T', color: 'Blue', colorCode: '#0000FF', stock: 18, price: 22.99, sku: 'DAS-4T-BLUE' },
          { size: '5T', color: 'Blue', colorCode: '#0000FF', stock: 14, price: 22.99, sku: 'DAS-5T-BLUE' }
        ],
        tags: ['kids', 'dinosaur', 'adventure', 'boys'],
        features: ['Colorful prints', 'Comfortable fit', 'Durable fabric'],
        materials: ['Cotton blend'],
        careInstructions: 'Machine wash warm, tumble dry low',
        isFeatured: true
      }
    ];

    // Add more products to reach 30
    const additionalProducts = [];
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Gray'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const kidsSizes = ['2T', '3T', '4T', '5T', '6', '8', '10', '12'];

    for (let i = 8; i <= 30; i++) {
      const isKids = i % 3 === 0;
      const category = isKids ? (i % 2 === 0 ? kidsGirls._id : kidsBoys._id) : (i % 2 === 0 ? womenTops._id : womenDresses._id);
      const productSizes = isKids ? kidsSizes.slice(0, 4) : sizes.slice(0, 4);
      
      const variants = productSizes.map((size, index) => ({
        size,
        color: colors[index % colors.length],
        colorCode: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
        stock: Math.floor(Math.random() * 20) + 5,
        price: Math.floor(Math.random() * 50) + 20,
        sku: `PROD${i}-${size}-${colors[index % colors.length].toUpperCase()}`
      }));

      additionalProducts.push({
        name: `Product ${i} ${isKids ? 'Kids' : 'Women'}`,
        description: `This is a sample product ${i} description. High quality ${isKids ? 'children\'s' : 'women\'s'} clothing item.`,
        shortDescription: `Sample product ${i}`,
        category,
        brand: 'SampleBrand',
        basePrice: variants[0].price,
        images: [
          { url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800`, alt: `Product ${i}` }
        ],
        variants,
        tags: [isKids ? 'kids' : 'women', 'sample', 'clothing'],
        features: ['High quality', 'Comfortable', 'Stylish'],
        materials: ['Cotton blend'],
        careInstructions: 'Machine wash cold',
        isFeatured: i % 5 === 0
      });
    }

    // Create all products
    await Product.create([...products, ...additionalProducts]);

    console.log('Created 30 sample products');
    console.log('Seeding completed successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@site.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();