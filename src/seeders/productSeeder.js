import mongoose from 'mongoose';
import Product from '../models/Product.js';
import CategoryNew from '../models/CategoryNew.js';
import Collection from '../models/Collection.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get categories and collections
    const womenStitchedTwoPiece = await CategoryNew.findOne({ slug: 'two-piece', stitchType: 'stitched' });
    const womenUnstitchedThreePiece = await CategoryNew.findOne({ slug: 'unstitched-three-piece' });
    const boysShirts = await CategoryNew.findOne({ slug: 'boys-shirts' });
    const girlsFrock = await CategoryNew.findOne({ slug: 'girls-frock' });
    
    const summerCollection = await Collection.findOne({ slug: 'summer-collection' });
    const newArrivals = await Collection.findOne({ slug: 'new-arrivals' });

    const sampleProducts = [
      {
        name: 'Elegant Summer Lawn Suit - Two Piece',
        slug: 'elegant-summer-lawn-suit-two-piece',
        description: 'Beautiful summer lawn suit with intricate embroidery work. Perfect for casual and formal occasions.',
        shortDescription: 'Elegant summer lawn suit with embroidery',
        categories: [womenStitchedTwoPiece._id],
        collections: [summerCollection._id, newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'women',
        season: 'summer',
        price: 4500,
        discountedPrice: 3800,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
            alt: 'Elegant Summer Lawn Suit'
          }
        ],
        variants: [
          { size: 'S', stock: 10, price: 3800 },
          { size: 'M', stock: 15, price: 3800 },
          { size: 'L', stock: 8, price: 3800 }
        ],
        colors: ['Blue', 'Pink', 'White'],
        tags: ['summer', 'lawn', 'embroidery', 'casual', 'formal'],
        features: ['Premium lawn fabric', 'Hand embroidery', 'Comfortable fit'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Premium Unstitched Three Piece - Chiffon',
        slug: 'premium-unstitched-three-piece-chiffon',
        description: 'Luxurious unstitched three piece chiffon suit with beautiful prints and dupatta.',
        shortDescription: 'Premium unstitched chiffon three piece',
        categories: [womenUnstitchedThreePiece._id],
        collections: [summerCollection._id],
        stitchType: 'unstitched',
        pieceCount: 3,
        targetGender: 'women',
        season: 'summer',
        price: 6500,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
            alt: 'Premium Chiffon Three Piece'
          }
        ],
        colors: ['Maroon', 'Navy Blue', 'Emerald Green'],
        tags: ['unstitched', 'chiffon', 'luxury', 'three-piece'],
        features: ['Premium chiffon fabric', 'Digital print', 'Matching dupatta'],
        stock: 20,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Boys Cotton Shirt - Casual Wear',
        slug: 'boys-cotton-shirt-casual',
        description: 'Comfortable cotton shirt for boys. Perfect for school and casual outings.',
        shortDescription: 'Boys comfortable cotton shirt',
        categories: [boysShirts._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'boys',
        season: 'all-season',
        price: 1200,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500',
            alt: 'Boys Cotton Shirt'
          }
        ],
        variants: [
          { size: '3-4Y', stock: 5, price: 1200 },
          { size: '5-6Y', stock: 8, price: 1200 },
          { size: '7-8Y', stock: 6, price: 1200 }
        ],
        colors: ['White', 'Light Blue', 'Cream'],
        tags: ['boys', 'cotton', 'casual', 'school'],
        features: ['100% cotton', 'Easy care', 'Comfortable fit'],
        isActive: true
      },
      {
        name: 'Girls Party Frock - Embroidered',
        slug: 'girls-party-frock-embroidered',
        description: 'Beautiful embroidered frock for girls. Perfect for parties and special occasions.',
        shortDescription: 'Girls embroidered party frock',
        categories: [girlsFrock._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'girls',
        season: 'all-season',
        price: 2200,
        discountedPrice: 1800,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500',
            alt: 'Girls Party Frock'
          }
        ],
        variants: [
          { size: '2-3Y', stock: 4, price: 1800 },
          { size: '4-5Y', stock: 6, price: 1800 },
          { size: '6-7Y', stock: 5, price: 1800 }
        ],
        colors: ['Pink', 'Purple', 'Red'],
        tags: ['girls', 'frock', 'party', 'embroidery'],
        features: ['Hand embroidery', 'Soft fabric', 'Party wear'],
        isActive: true,
        isFeatured: true
      }
    ];

    await Product.deleteMany({});
    const products = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Created ${products.length} sample products`);
    console.log('Products created:');
    products.forEach(product => {
      console.log(`- ${product.name} (${product.targetGender}, ${product.stitchType}, ${product.pieceCount} piece)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Product seeding failed:', error);
    process.exit(1);
  }
}

seedProducts();