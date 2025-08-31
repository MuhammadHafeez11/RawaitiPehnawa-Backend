import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-t-shirt',
    description: 'Comfortable and stylish cotton t-shirt perfect for everyday wear. Made from 100% premium cotton with a soft feel.',
    shortDescription: 'Premium cotton t-shirt for everyday comfort',
    brand: 'Elegance',
    price: 1500,
    discountedPrice: 1200,
    stock: 50,
    tags: ['casual', 'cotton', 'comfortable'],
    features: ['100% Cotton', 'Machine Washable', 'Breathable'],
    materials: ['Cotton'],
    careInstructions: 'Machine wash cold, tumble dry low',
    isActive: true,
    isFeatured: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      alt: 'Premium Cotton T-Shirt'
    }]
  },
  {
    name: 'Elegant Silk Dress',
    slug: 'elegant-silk-dress',
    description: 'Beautiful silk dress perfect for special occasions. Features elegant design and premium silk fabric.',
    shortDescription: 'Elegant silk dress for special occasions',
    brand: 'Elegance',
    price: 8500,
    discountedPrice: 6800,
    stock: 25,
    tags: ['formal', 'silk', 'elegant'],
    features: ['Pure Silk', 'Hand Wash Only', 'Elegant Design'],
    materials: ['Silk'],
    careInstructions: 'Hand wash only, dry clean recommended',
    isActive: true,
    isFeatured: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      alt: 'Elegant Silk Dress'
    }]
  },
  {
    name: 'Casual Denim Jeans',
    slug: 'casual-denim-jeans',
    description: 'Classic denim jeans with modern fit. Perfect for casual outings and everyday wear.',
    shortDescription: 'Classic denim jeans with modern fit',
    brand: 'Elegance',
    price: 3500,
    stock: 40,
    tags: ['casual', 'denim', 'jeans'],
    features: ['Stretch Denim', 'Modern Fit', 'Durable'],
    materials: ['Cotton', 'Elastane'],
    careInstructions: 'Machine wash cold, hang dry',
    isActive: true,
    isFeatured: false,
    images: [{
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      alt: 'Casual Denim Jeans'
    }]
  },
  {
    name: 'Formal Blazer',
    description: 'Professional blazer perfect for office wear and formal events. Tailored fit with premium fabric.',
    shortDescription: 'Professional blazer for office wear',
    brand: 'Elegance',
    price: 12000,
    discountedPrice: 9600,
    stock: 20,
    tags: ['formal', 'blazer', 'professional'],
    features: ['Tailored Fit', 'Premium Fabric', 'Professional Look'],
    materials: ['Wool', 'Polyester'],
    careInstructions: 'Dry clean only',
    isActive: true,
    isFeatured: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      alt: 'Formal Blazer'
    }]
  },
  {
    name: 'Summer Floral Top',
    description: 'Light and breezy floral top perfect for summer days. Features beautiful floral print and comfortable fit.',
    shortDescription: 'Light floral top for summer',
    brand: 'Elegance',
    price: 2200,
    discountedPrice: 1760,
    stock: 35,
    tags: ['summer', 'floral', 'casual'],
    features: ['Floral Print', 'Lightweight', 'Comfortable Fit'],
    materials: ['Viscose'],
    careInstructions: 'Machine wash cold, hang dry',
    isActive: true,
    isFeatured: false,
    images: [{
      url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
      alt: 'Summer Floral Top'
    }]
  },
  {
    name: 'Leather Jacket',
    description: 'Stylish leather jacket for a bold look. Made from genuine leather with modern design.',
    shortDescription: 'Stylish genuine leather jacket',
    brand: 'Elegance',
    price: 15000,
    discountedPrice: 12000,
    stock: 15,
    tags: ['leather', 'jacket', 'stylish'],
    features: ['Genuine Leather', 'Modern Design', 'Durable'],
    materials: ['Leather'],
    careInstructions: 'Professional leather cleaning only',
    isActive: true,
    isFeatured: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      alt: 'Leather Jacket'
    }]
  },
  {
    name: 'Casual Hoodie',
    description: 'Comfortable hoodie perfect for casual wear and chilly days. Soft fabric with adjustable hood.',
    shortDescription: 'Comfortable hoodie for casual wear',
    brand: 'Elegance',
    price: 2800,
    stock: 45,
    tags: ['casual', 'hoodie', 'comfortable'],
    features: ['Soft Fabric', 'Adjustable Hood', 'Kangaroo Pocket'],
    materials: ['Cotton', 'Polyester'],
    careInstructions: 'Machine wash warm, tumble dry low',
    isActive: true,
    isFeatured: false,
    images: [{
      url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      alt: 'Casual Hoodie'
    }]
  },
  {
    name: 'Elegant Evening Gown',
    description: 'Stunning evening gown for special occasions. Features elegant design and luxurious fabric.',
    shortDescription: 'Stunning evening gown for special events',
    brand: 'Elegance',
    price: 18000,
    discountedPrice: 14400,
    stock: 10,
    tags: ['formal', 'gown', 'elegant'],
    features: ['Luxurious Fabric', 'Elegant Design', 'Special Occasion'],
    materials: ['Satin', 'Chiffon'],
    careInstructions: 'Dry clean only',
    isActive: true,
    isFeatured: true,
    images: [{
      url: 'https://images.unsplash.com/photo-1566479179817-c0b2b2b5b5b5?w=800',
      alt: 'Elegant Evening Gown'
    }]
  },
  {
    name: 'Sports Track Suit',
    description: 'Comfortable track suit perfect for sports and exercise. Breathable fabric with modern fit.',
    shortDescription: 'Comfortable track suit for sports',
    brand: 'Elegance',
    price: 4500,
    discountedPrice: 3600,
    stock: 30,
    tags: ['sports', 'tracksuit', 'exercise'],
    features: ['Breathable Fabric', 'Modern Fit', 'Moisture Wicking'],
    materials: ['Polyester', 'Elastane'],
    careInstructions: 'Machine wash cold, hang dry',
    isActive: true,
    isFeatured: false,
    images: [{
      url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800',
      alt: 'Sports Track Suit'
    }]
  },
  {
    name: 'Vintage Denim Jacket',
    description: 'Classic vintage-style denim jacket. Perfect for layering and casual styling.',
    shortDescription: 'Classic vintage denim jacket',
    brand: 'Elegance',
    price: 4200,
    stock: 25,
    tags: ['vintage', 'denim', 'jacket'],
    features: ['Vintage Style', 'Classic Fit', 'Durable Denim'],
    materials: ['Cotton Denim'],
    careInstructions: 'Machine wash cold, hang dry',
    isActive: true,
    isFeatured: false,
    images: [{
      url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800',
      alt: 'Vintage Denim Jacket'
    }]
  }
];

// Generate more products programmatically
const generateMoreProducts = () => {
  const productTypes = [
    'Shirt', 'Pants', 'Skirt', 'Sweater', 'Cardigan', 'Shorts', 'Blouse', 'Tunic',
    'Jumpsuit', 'Romper', 'Coat', 'Vest', 'Scarf', 'Shawl', 'Kimono', 'Poncho',
    'Leggings', 'Joggers', 'Palazzo', 'Capri'
  ];
  
  const adjectives = [
    'Premium', 'Luxury', 'Casual', 'Elegant', 'Modern', 'Classic', 'Trendy', 'Stylish',
    'Comfortable', 'Chic', 'Sophisticated', 'Contemporary', 'Vintage', 'Designer'
  ];
  
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Maroon', 'Olive', 'Cream'];
  
  const additionalProducts = [];
  
  for (let i = 0; i < 20; i++) {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const basePrice = Math.floor(Math.random() * 10000) + 1000; // 1000-11000
    const hasDiscount = Math.random() > 0.5;
    const discountedPrice = hasDiscount ? Math.floor(basePrice * 0.8) : undefined;
    
    const productName = `${adjective} ${color} ${productType}`;
    const productSlug = productName.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
    
    additionalProducts.push({
      name: productName,
      slug: productSlug,
      description: `High-quality ${productType.toLowerCase()} made with premium materials. Perfect for various occasions and comfortable all-day wear.`,
      shortDescription: `${adjective} ${productType.toLowerCase()} in ${color.toLowerCase()}`,
      brand: 'Elegance',
      price: basePrice,
      discountedPrice: discountedPrice,
      stock: Math.floor(Math.random() * 50) + 10, // 10-60
      tags: ['fashion', 'clothing', productType.toLowerCase()],
      features: ['Premium Quality', 'Comfortable Fit', 'Durable'],
      materials: ['Cotton', 'Polyester'],
      careInstructions: 'Machine wash cold, tumble dry low',
      isActive: true,
      isFeatured: Math.random() > 0.7, // 30% chance of being featured
      images: [{
        url: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800`,
        alt: `${adjective} ${color} ${productType}`
      }]
    });
  }
  
  return additionalProducts;
};

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Get categories
    const categories = await Category.find({});
    if (categories.length === 0) {
      console.log('No categories found. Please seed categories first.');
      return;
    }

    // Combine sample products with generated ones
    const allProducts = [...sampleProducts, ...generateMoreProducts()];

    // Assign random categories to products
    const productsWithCategories = allProducts.map(product => ({
      ...product,
      category: categories[Math.floor(Math.random() * categories.length)]._id
    }));

    // Insert products
    const insertedProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    // Display summary
    const featuredCount = insertedProducts.filter(p => p.isFeatured).length;
    const discountedCount = insertedProducts.filter(p => p.discountedPrice).length;
    
    console.log(`📊 Summary:`);
    console.log(`   - Total Products: ${insertedProducts.length}`);
    console.log(`   - Featured Products: ${featuredCount}`);
    console.log(`   - Discounted Products: ${discountedCount}`);
    console.log(`   - Categories Used: ${categories.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();