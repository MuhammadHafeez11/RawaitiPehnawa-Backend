import mongoose from 'mongoose';
import Product from '../models/Product.js';
import CategoryNew from '../models/CategoryNew.js';
import Collection from '../models/Collection.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedKidsProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = await CategoryNew.find({});
    const collections = await Collection.find({});

    const findCategory = (slug) => categories.find(cat => cat.slug === slug);
    const findCollection = (slug) => collections.find(col => col.slug === slug);

    const summerCollection = findCollection('summer-collection');
    const winterCollection = findCollection('winter-collection');
    const newArrivals = findCollection('new-arrivals');

    const kidsProducts = [];

    // BOYS PRODUCTS
    const boys = findCategory('boys');
    
    // Boys Shalwar Kameez (4 products)
    kidsProducts.push(
      {
        name: 'Boys Cotton Shalwar Kameez - White',
        slug: 'boys-cotton-shalwar-kameez-white',
        description: 'Traditional white cotton shalwar kameez for boys.',
        shortDescription: 'Boys cotton shalwar kameez',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shalwar-kameez')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'boys',
        season: 'summer',
        price: 1800,
        images: [{ url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500', alt: 'Boys Shalwar Kameez' }],
        variants: [
          { size: '3-4Y', stock: 8, price: 1800 },
          { size: '5-6Y', stock: 10, price: 1800 },
          { size: '7-8Y', stock: 6, price: 1800 }
        ],
        colors: ['White', 'Cream', 'Light Blue'],
        tags: ['boys', 'shalwar-kameez', 'traditional'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Boys Embroidered Kurta Pajama',
        slug: 'boys-embroidered-kurta-pajama',
        description: 'Elegant embroidered kurta pajama for special occasions.',
        shortDescription: 'Boys embroidered kurta pajama',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shalwar-kameez')._id],
        collections: [winterCollection._id, newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'boys',
        season: 'winter',
        price: 2500,
        images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500', alt: 'Boys Kurta Pajama' }],
        variants: [
          { size: '4-5Y', stock: 6, price: 2500 },
          { size: '6-7Y', stock: 8, price: 2500 },
          { size: '8-9Y', stock: 5, price: 2500 }
        ],
        colors: ['Navy', 'Maroon', 'Golden'],
        tags: ['boys', 'embroidered', 'formal'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Boys Casual Shalwar Kameez',
        slug: 'boys-casual-shalwar-kameez',
        description: 'Comfortable casual shalwar kameez for everyday wear.',
        shortDescription: 'Boys casual shalwar kameez',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shalwar-kameez')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'boys',
        season: 'all-season',
        price: 1500,
        images: [{ url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', alt: 'Boys Casual Wear' }],
        variants: [
          { size: '2-3Y', stock: 10, price: 1500 },
          { size: '4-5Y', stock: 12, price: 1500 },
          { size: '6-7Y', stock: 8, price: 1500 }
        ],
        colors: ['Grey', 'Khaki', 'Light Green'],
        tags: ['boys', 'casual', 'comfortable'],
        isActive: true
      },
      {
        name: 'Boys Party Wear Shalwar Kameez',
        slug: 'boys-party-wear-shalwar-kameez',
        description: 'Stylish party wear shalwar kameez for boys.',
        shortDescription: 'Boys party wear',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shalwar-kameez')._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'boys',
        season: 'all-season',
        price: 2200,
        images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500', alt: 'Boys Party Wear' }],
        variants: [
          { size: '5-6Y', stock: 5, price: 2200 },
          { size: '7-8Y', stock: 7, price: 2200 },
          { size: '9-10Y', stock: 4, price: 2200 }
        ],
        colors: ['Black', 'Royal Blue', 'Wine'],
        tags: ['boys', 'party', 'stylish'],
        isActive: true
      }
    );

    // Boys Shirts (4 products)
    kidsProducts.push(
      {
        name: 'Boys Cotton Shirt - School Uniform',
        slug: 'boys-cotton-shirt-school-uniform',
        description: 'Comfortable cotton shirt perfect for school.',
        shortDescription: 'Boys school shirt',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shirts')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'boys',
        season: 'all-season',
        price: 1200,
        images: [{ url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500', alt: 'Boys School Shirt' }],
        variants: [
          { size: '3-4Y', stock: 15, price: 1200 },
          { size: '5-6Y', stock: 18, price: 1200 },
          { size: '7-8Y', stock: 12, price: 1200 }
        ],
        colors: ['White', 'Light Blue', 'Cream'],
        tags: ['boys', 'shirt', 'school'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Boys Casual Polo Shirt',
        slug: 'boys-casual-polo-shirt',
        description: 'Stylish polo shirt for casual outings.',
        shortDescription: 'Boys polo shirt',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shirts')._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'boys',
        season: 'summer',
        price: 1400,
        images: [{ url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', alt: 'Boys Polo Shirt' }],
        variants: [
          { size: '4-5Y', stock: 10, price: 1400 },
          { size: '6-7Y', stock: 12, price: 1400 },
          { size: '8-9Y', stock: 8, price: 1400 }
        ],
        colors: ['Red', 'Green', 'Navy'],
        tags: ['boys', 'polo', 'casual'],
        isActive: true
      },
      {
        name: 'Boys Formal Dress Shirt',
        slug: 'boys-formal-dress-shirt',
        description: 'Formal dress shirt for special occasions.',
        shortDescription: 'Boys formal shirt',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shirts')._id],
        collections: [winterCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'boys',
        season: 'all-season',
        price: 1800,
        images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500', alt: 'Boys Formal Shirt' }],
        variants: [
          { size: '5-6Y', stock: 6, price: 1800 },
          { size: '7-8Y', stock: 8, price: 1800 },
          { size: '9-10Y', stock: 5, price: 1800 }
        ],
        colors: ['White', 'Light Pink', 'Sky Blue'],
        tags: ['boys', 'formal', 'dress'],
        isActive: true
      },
      {
        name: 'Boys Printed T-Shirt',
        slug: 'boys-printed-t-shirt',
        description: 'Fun printed t-shirt for everyday wear.',
        shortDescription: 'Boys printed t-shirt',
        categories: [findCategory('kids')._id, boys._id, findCategory('boys-shirts')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'boys',
        season: 'summer',
        price: 900,
        images: [{ url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', alt: 'Boys T-Shirt' }],
        variants: [
          { size: '2-3Y', stock: 20, price: 900 },
          { size: '4-5Y', stock: 18, price: 900 },
          { size: '6-7Y', stock: 15, price: 900 }
        ],
        colors: ['Blue', 'Red', 'Yellow'],
        tags: ['boys', 'printed', 't-shirt'],
        isActive: true
      }
    );

    // GIRLS PRODUCTS
    const girls = findCategory('girls');
    
    // Girls Shalwar Kameez (4 products)
    kidsProducts.push(
      {
        name: 'Girls Embroidered Shalwar Kameez',
        slug: 'girls-embroidered-shalwar-kameez',
        description: 'Beautiful embroidered shalwar kameez for girls.',
        shortDescription: 'Girls embroidered shalwar kameez',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-shalwar-kameez')._id],
        collections: [winterCollection._id, newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'girls',
        season: 'winter',
        price: 2200,
        images: [{ url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500', alt: 'Girls Shalwar Kameez' }],
        variants: [
          { size: '3-4Y', stock: 8, price: 2200 },
          { size: '5-6Y', stock: 10, price: 2200 },
          { size: '7-8Y', stock: 6, price: 2200 }
        ],
        colors: ['Pink', 'Purple', 'Peach'],
        tags: ['girls', 'embroidered', 'traditional'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Girls Cotton Shalwar Kameez',
        slug: 'girls-cotton-shalwar-kameez',
        description: 'Comfortable cotton shalwar kameez for daily wear.',
        shortDescription: 'Girls cotton shalwar kameez',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-shalwar-kameez')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'girls',
        season: 'summer',
        price: 1600,
        images: [{ url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', alt: 'Girls Cotton Suit' }],
        variants: [
          { size: '2-3Y', stock: 12, price: 1600 },
          { size: '4-5Y', stock: 15, price: 1600 },
          { size: '6-7Y', stock: 10, price: 1600 }
        ],
        colors: ['Light Pink', 'Mint', 'Lavender'],
        tags: ['girls', 'cotton', 'comfortable'],
        isActive: true
      },
      {
        name: 'Girls Party Shalwar Kameez',
        slug: 'girls-party-shalwar-kameez',
        description: 'Elegant party wear shalwar kameez for girls.',
        shortDescription: 'Girls party shalwar kameez',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-shalwar-kameez')._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'girls',
        season: 'all-season',
        price: 2800,
        images: [{ url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500', alt: 'Girls Party Wear' }],
        variants: [
          { size: '4-5Y', stock: 5, price: 2800 },
          { size: '6-7Y', stock: 7, price: 2800 },
          { size: '8-9Y', stock: 4, price: 2800 }
        ],
        colors: ['Red', 'Royal Blue', 'Golden'],
        tags: ['girls', 'party', 'elegant'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Girls Casual Shalwar Kameez',
        slug: 'girls-casual-shalwar-kameez',
        description: 'Simple and comfortable shalwar kameez for everyday use.',
        shortDescription: 'Girls casual shalwar kameez',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-shalwar-kameez')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 2,
        targetGender: 'girls',
        season: 'all-season',
        price: 1400,
        images: [{ url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', alt: 'Girls Casual Wear' }],
        variants: [
          { size: '3-4Y', stock: 10, price: 1400 },
          { size: '5-6Y', stock: 12, price: 1400 },
          { size: '7-8Y', stock: 8, price: 1400 }
        ],
        colors: ['White', 'Cream', 'Light Yellow'],
        tags: ['girls', 'casual', 'simple'],
        isActive: true
      }
    );

    // Girls Frock (4 products)
    kidsProducts.push(
      {
        name: 'Girls Party Frock - Embroidered',
        slug: 'girls-party-frock-embroidered',
        description: 'Beautiful embroidered frock perfect for parties.',
        shortDescription: 'Girls embroidered party frock',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-frock')._id],
        collections: [newArrivals._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'girls',
        season: 'all-season',
        price: 2200,
        discountedPrice: 1800,
        images: [{ url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500', alt: 'Girls Party Frock' }],
        variants: [
          { size: '2-3Y', stock: 6, price: 1800 },
          { size: '4-5Y', stock: 8, price: 1800 },
          { size: '6-7Y', stock: 5, price: 1800 }
        ],
        colors: ['Pink', 'Purple', 'Red'],
        tags: ['girls', 'frock', 'party', 'embroidery'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Girls Summer Cotton Frock',
        slug: 'girls-summer-cotton-frock',
        description: 'Light and comfortable cotton frock for summer.',
        shortDescription: 'Girls summer cotton frock',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-frock')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'girls',
        season: 'summer',
        price: 1500,
        images: [{ url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', alt: 'Girls Summer Frock' }],
        variants: [
          { size: '2-3Y', stock: 10, price: 1500 },
          { size: '4-5Y', stock: 12, price: 1500 },
          { size: '6-7Y', stock: 8, price: 1500 }
        ],
        colors: ['Light Blue', 'Yellow', 'Peach'],
        tags: ['girls', 'summer', 'cotton', 'comfortable'],
        isActive: true
      },
      {
        name: 'Girls Formal Frock - Velvet',
        slug: 'girls-formal-frock-velvet',
        description: 'Elegant velvet frock for formal occasions.',
        shortDescription: 'Girls velvet formal frock',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-frock')._id],
        collections: [winterCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'girls',
        season: 'winter',
        price: 3200,
        images: [{ url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500', alt: 'Girls Velvet Frock' }],
        variants: [
          { size: '3-4Y', stock: 4, price: 3200 },
          { size: '5-6Y', stock: 6, price: 3200 },
          { size: '7-8Y', stock: 3, price: 3200 }
        ],
        colors: ['Maroon', 'Navy', 'Emerald'],
        tags: ['girls', 'velvet', 'formal', 'elegant'],
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Girls Casual Printed Frock',
        slug: 'girls-casual-printed-frock',
        description: 'Fun printed frock for everyday wear.',
        shortDescription: 'Girls printed casual frock',
        categories: [findCategory('kids')._id, girls._id, findCategory('girls-frock')._id],
        collections: [summerCollection._id],
        stitchType: 'stitched',
        pieceCount: 1,
        targetGender: 'girls',
        season: 'summer',
        price: 1200,
        images: [{ url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500', alt: 'Girls Printed Frock' }],
        variants: [
          { size: '2-3Y', stock: 15, price: 1200 },
          { size: '4-5Y', stock: 18, price: 1200 },
          { size: '6-7Y', stock: 12, price: 1200 }
        ],
        colors: ['Floral', 'Polka Dots', 'Stripes'],
        tags: ['girls', 'printed', 'casual', 'fun'],
        isActive: true
      }
    );

    console.log('Creating kids products...');
    const createdProducts = await Product.insertMany(kidsProducts);
    console.log(`✅ Created ${createdProducts.length} kids products successfully!`);
    
    // Log summary
    const summary = {};
    createdProducts.forEach(product => {
      const key = `${product.targetGender}-${product.stitchType}-${product.pieceCount}piece`;
      summary[key] = (summary[key] || 0) + 1;
    });
    
    console.log('\n📊 Kids Products Summary:');
    Object.entries(summary).forEach(([key, count]) => {
      console.log(`${key}: ${count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Kids product seeding failed:', error);
    process.exit(1);
  }
}

seedKidsProducts();