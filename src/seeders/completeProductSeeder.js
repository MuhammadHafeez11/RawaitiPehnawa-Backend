import mongoose from 'mongoose';
import Product from '../models/Product.js';
import CategoryNew from '../models/CategoryNew.js';
import Collection from '../models/Collection.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedCompleteProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all categories and collections
    const categories = await CategoryNew.find({});
    const collections = await Collection.find({});

    // Helper function to find category by slug
    const findCategory = (slug) => categories.find(cat => cat.slug === slug);
    const findCollection = (slug) => collections.find(col => col.slug === slug);

    // Clear existing products
    await Product.deleteMany({});

    const products = [];

    // WOMEN STITCHED PRODUCTS
    const womenStitched = findCategory('stitched');
    const womenOnePiece = findCategory('one-piece');
    const womenTwoPiece = findCategory('two-piece');
    const womenThreePiece = findCategory('three-piece');
    const summerCollection = findCollection('summer-collection');
    const winterCollection = findCollection('winter-collection');
    const newArrivals = findCollection('new-arrivals');

    // Women Stitched One Piece (4 products)
    products.push(
      {
        name: 'Elegant Embroidered Kurti - Summer',
        slug: 'elegant-embroidered-kurti-summer',
        description: 'Beautiful summer kurti with intricate embroidery work. Perfect for casual and formal occasions.',
        shortDescription: 'Elegant embroidered kurti',
        categories: [findCategory('women')._id, womenStitched._id, womenOnePiece._id],
        collections: [summerCollection._id, newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'summer',
        price: 2800,
        discountedPrice: 2400,
        images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Elegant Kurti' }],
        variants: [
          { size: 'S', stock: 10, price: 2400 },
          { size: 'M', stock: 15, price: 2400 },
          { size: 'L', stock: 8, price: 2400 }
        ],
        colors: ['Blue', 'Pink', 'White'],
        tags: ['kurti', 'embroidery', 'summer', 'casual'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Premium Lawn Shirt - Printed',
        slug: 'premium-lawn-shirt-printed',
        description: 'Premium quality lawn shirt with beautiful digital prints.',
        shortDescription: 'Premium printed lawn shirt',
        categories: [findCategory('women')._id, womenStitched._id, womenOnePiece._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'summer',
        price: 2200,
        images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', alt: 'Lawn Shirt' }],
        variants: [
          { size: 'S', stock: 12, price: 2200 },
          { size: 'M', stock: 18, price: 2200 },
          { size: 'L', stock: 10, price: 2200 }
        ],
        colors: ['Green', 'Yellow', 'Orange'],
        tags: ['lawn', 'printed', 'summer'],
        isActive: true
      },
      {
        name: 'Winter Wool Kurti - Warm',
        slug: 'winter-wool-kurti-warm',
        description: 'Warm wool kurti perfect for winter season.',
        shortDescription: 'Winter wool kurti',
        categories: [findCategory('women')._id, womenStitched._id, womenOnePiece._id],
        collections: [winterCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'winter',
        price: 3500,
        images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', alt: 'Winter Kurti' }],
        variants: [
          { size: 'S', stock: 8, price: 3500 },
          { size: 'M', stock: 12, price: 3500 },
          { size: 'L', stock: 6, price: 3500 }
        ],
        colors: ['Maroon', 'Navy', 'Black'],
        tags: ['wool', 'winter', 'warm'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Casual Cotton Top - Everyday',
        slug: 'casual-cotton-top-everyday',
        description: 'Comfortable cotton top for everyday wear.',
        shortDescription: 'Casual cotton top',
        categories: [findCategory('women')._id, womenStitched._id, womenOnePiece._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'all-season',
        price: 1800,
        images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Cotton Top' }],
        variants: [
          { size: 'S', stock: 15, price: 1800 },
          { size: 'M', stock: 20, price: 1800 },
          { size: 'L', stock: 12, price: 1800 }
        ],
        colors: ['White', 'Cream', 'Light Blue'],
        tags: ['cotton', 'casual', 'everyday'],
        isActive: true
      }
    );

    // Women Stitched Two Piece (4 products)
    products.push(
      {
        name: 'Summer Lawn Suit - Two Piece',
        slug: 'summer-lawn-suit-two-piece',
        description: 'Beautiful summer lawn suit with matching dupatta.',
        shortDescription: 'Summer lawn two piece suit',
        categories: [findCategory('women')._id, womenStitched._id, womenTwoPiece._id],
        collections: [summerCollection._id, newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'women',
        season: 'summer',
        price: 4500,
        discountedPrice: 3800,
        images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Two Piece Suit' }],
        variants: [
          { size: 'S', stock: 10, price: 3800 },
          { size: 'M', stock: 15, price: 3800 },
          { size: 'L', stock: 8, price: 3800 }
        ],
        colors: ['Blue', 'Pink', 'White'],
        tags: ['lawn', 'two-piece', 'summer'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Embroidered Kameez Shalwar',
        slug: 'embroidered-kameez-shalwar',
        description: 'Traditional embroidered kameez with matching shalwar.',
        shortDescription: 'Embroidered kameez shalwar',
        categories: [findCategory('women')._id, womenStitched._id, womenTwoPiece._id],
        collections: [winterCollection._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'women',
        season: 'winter',
        price: 5200,
        images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', alt: 'Kameez Shalwar' }],
        variants: [
          { size: 'S', stock: 8, price: 5200 },
          { size: 'M', stock: 12, price: 5200 },
          { size: 'L', stock: 6, price: 5200 }
        ],
        colors: ['Red', 'Green', 'Gold'],
        tags: ['embroidery', 'traditional', 'winter'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Casual Cotton Set - Two Piece',
        slug: 'casual-cotton-set-two-piece',
        description: 'Comfortable cotton two piece set for daily wear.',
        shortDescription: 'Casual cotton two piece',
        categories: [findCategory('women')._id, womenStitched._id, womenTwoPiece._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'women',
        season: 'all-season',
        price: 3200,
        images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', alt: 'Cotton Set' }],
        variants: [
          { size: 'S', stock: 12, price: 3200 },
          { size: 'M', stock: 16, price: 3200 },
          { size: 'L', stock: 10, price: 3200 }
        ],
        colors: ['Beige', 'Grey', 'Navy'],
        tags: ['cotton', 'casual', 'comfortable'],
        isActive: true
      },
      {
        name: 'Formal Office Wear - Two Piece',
        slug: 'formal-office-wear-two-piece',
        description: 'Professional two piece outfit for office wear.',
        shortDescription: 'Formal office two piece',
        categories: [findCategory('women')._id, womenStitched._id, womenTwoPiece._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'women',
        season: 'all-season',
        price: 4800,
        images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Office Wear' }],
        variants: [
          { size: 'S', stock: 6, price: 4800 },
          { size: 'M', stock: 10, price: 4800 },
          { size: 'L', stock: 8, price: 4800 }
        ],
        colors: ['Black', 'Navy', 'Charcoal'],
        tags: ['formal', 'office', 'professional'],
        isActive: true
      }
    );

    // Women Stitched Three Piece (4 products)
    products.push(
      {
        name: 'Premium Chiffon Three Piece',
        slug: 'premium-chiffon-three-piece',
        description: 'Luxurious chiffon three piece with beautiful embroidery.',
        shortDescription: 'Premium chiffon three piece',
        categories: [findCategory('women')._id, womenStitched._id, womenThreePiece._id],
        collections: [summerCollection._id, newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 3,
        targetGender: 'women',
        season: 'summer',
        price: 7500,
        discountedPrice: 6200,
        images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Chiffon Three Piece' }],
        variants: [
          { size: 'S', stock: 5, price: 6200 },
          { size: 'M', stock: 8, price: 6200 },
          { size: 'L', stock: 4, price: 6200 }
        ],
        colors: ['Peach', 'Mint', 'Lavender'],
        tags: ['chiffon', 'luxury', 'three-piece'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Wedding Collection Three Piece',
        slug: 'wedding-collection-three-piece',
        description: 'Elegant three piece suit perfect for weddings.',
        shortDescription: 'Wedding three piece suit',
        categories: [findCategory('women')._id, womenStitched._id, womenThreePiece._id],
        collections: [winterCollection._id],
        stitchType: 'stitched',
        pieceCount: 3,
        targetGender: 'women',
        season: 'winter',
        price: 12000,
        images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', alt: 'Wedding Suit' }],
        variants: [
          { size: 'S', stock: 3, price: 12000 },
          { size: 'M', stock: 5, price: 12000 },
          { size: 'L', stock: 2, price: 12000 }
        ],
        colors: ['Red', 'Maroon', 'Gold'],
        tags: ['wedding', 'formal', 'luxury'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Party Wear Three Piece',
        slug: 'party-wear-three-piece',
        description: 'Stylish three piece outfit for parties and events.',
        shortDescription: 'Party wear three piece',
        categories: [findCategory('women')._id, womenStitched._id, womenThreePiece._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 3,
        targetGender: 'women',
        season: 'all-season',
        price: 8500,
        images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', alt: 'Party Wear' }],
        variants: [
          { size: 'S', stock: 6, price: 8500 },
          { size: 'M', stock: 8, price: 8500 },
          { size: 'L', stock: 4, price: 8500 }
        ],
        colors: ['Black', 'Royal Blue', 'Emerald'],
        tags: ['party', 'stylish', 'events'],
        isActive: true
      },
      {
        name: 'Traditional Silk Three Piece',
        slug: 'traditional-silk-three-piece',
        description: 'Traditional silk three piece with authentic designs.',
        shortDescription: 'Traditional silk three piece',
        categories: [findCategory('women')._id, womenStitched._id, womenThreePiece._id],
        collections: [winterCollection._id],
        stitchType: 'stitched',
        pieceCount: 3,
        targetGender: 'women',
        season: 'winter',
        price: 9800,
        images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Silk Three Piece' }],
        variants: [
          { size: 'S', stock: 4, price: 9800 },
          { size: 'M', stock: 6, price: 9800 },
          { size: 'L', stock: 3, price: 9800 }
        ],
        colors: ['Deep Red', 'Royal Purple', 'Golden'],
        tags: ['silk', 'traditional', 'authentic'],
        isActive: true
      }
    );

    // WOMEN UNSTITCHED PRODUCTS (12 products - 4 each for one, two, three piece)
    const womenUnstitched = findCategory('unstitched');
    const womenUnstitchedOne = findCategory('unstitched-one-piece');
    const womenUnstitchedTwo = findCategory('unstitched-two-piece');
    const womenUnstitchedThree = findCategory('unstitched-three-piece');

    // Women Unstitched One Piece (4 products)
    products.push(
      {
        name: 'Premium Lawn Fabric - Unstitched',
        slug: 'premium-lawn-fabric-unstitched',
        description: 'High quality lawn fabric for custom stitching.',
        shortDescription: 'Premium lawn fabric',
        categories: [findCategory('women')._id, womenUnstitched._id, womenUnstitchedOne._id],
        collections: [summerCollection._id],
        stitchType: 'unstitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'summer',
        price: 1800,
        stock: 25,
        images: [{ url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500', alt: 'Lawn Fabric' }],
        colors: ['Floral Print', 'Geometric', 'Abstract'],
        tags: ['lawn', 'unstitched', 'fabric'],
        isActive: true
      },
      {
        name: 'Cotton Voile Fabric - Single',
        slug: 'cotton-voile-fabric-single',
        description: 'Soft cotton voile fabric perfect for summer wear.',
        shortDescription: 'Cotton voile fabric',
        categories: [findCategory('women')._id, womenUnstitched._id, womenUnstitchedOne._id],
        collections: [summerCollection._id, newArrivals._id],
        stitchType: 'unstitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'summer',
        price: 1500,
        stock: 30,
        images: [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500', alt: 'Voile Fabric' }],
        colors: ['Light Blue', 'Peach', 'Mint Green'],
        tags: ['cotton', 'voile', 'soft'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Khaddar Fabric - Winter',
        slug: 'khaddar-fabric-winter',
        description: 'Warm khaddar fabric ideal for winter clothing.',
        shortDescription: 'Khaddar winter fabric',
        categories: [findCategory('women')._id, womenUnstitched._id, womenUnstitchedOne._id],
        collections: [winterCollection._id],
        stitchType: 'unstitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'winter',
        price: 2200,
        stock: 20,
        images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', alt: 'Khaddar Fabric' }],
        colors: ['Brown', 'Olive', 'Rust'],
        tags: ['khaddar', 'winter', 'warm'],
        isActive: true
      },
      {
        name: 'Digital Print Fabric - Modern',
        slug: 'digital-print-fabric-modern',
        description: 'Modern digital print fabric with contemporary designs.',
        shortDescription: 'Digital print fabric',
        categories: [findCategory('women')._id, womenUnstitched._id, womenUnstitchedOne._id],
        collections: [newArrivals._id],
        stitchType: 'unstitched',
        pieceCount: 1,
        targetGender: 'women',
        season: 'all-season',
        price: 1900,
        stock: 22,
        images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500', alt: 'Digital Print' }],
        colors: ['Multi Color', 'Vibrant', 'Bold'],
        tags: ['digital', 'modern', 'contemporary'],
        isActive: true
      }
    );

    console.log('Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products successfully!`);
    
    // Log summary
    const summary = {};
    createdProducts.forEach(product => {
      const key = `${product.targetGender}-${product.stitchType}-${product.pieceCount}piece`;
      summary[key] = (summary[key] || 0) + 1;
    });
    
    console.log('\n📊 Products Summary:');
    Object.entries(summary).forEach(([key, count]) => {
      console.log(`${key}: ${count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Product seeding failed:', error);
    process.exit(1);
  }
}

seedCompleteProducts();