import mongoose from 'mongoose';
import CategoryNew from '../models/CategoryNew.js';
import Collection from '../models/Collection.js';
import dotenv from 'dotenv';

dotenv.config();

const categoryData = [
  // Women Categories
  {
    name: 'Women',
    slug: 'women',
    targetGender: 'women',
    categoryType: 'main',
    level: 0,
    sortOrder: 1,
    subcategories: [
      {
        name: 'Stitched',
        slug: 'stitched',
        targetGender: 'women',
        categoryType: 'stitch-type',
        stitchType: 'stitched',
        sortOrder: 1,
        subcategories: [
          {
            name: 'One Piece',
            slug: 'one-piece',
            targetGender: 'women',
            categoryType: 'piece-type',
            stitchType: 'stitched',
            pieceCount: 1,
            sizes: ['S', 'M', 'L'],
            sortOrder: 1
          },
          {
            name: 'Two Piece',
            slug: 'two-piece',
            targetGender: 'women',
            categoryType: 'piece-type',
            stitchType: 'stitched',
            pieceCount: 2,
            sizes: ['S', 'M', 'L'],
            sortOrder: 2
          },
          {
            name: 'Three Piece',
            slug: 'three-piece',
            targetGender: 'women',
            categoryType: 'piece-type',
            stitchType: 'stitched',
            pieceCount: 3,
            sizes: ['S', 'M', 'L'],
            sortOrder: 3
          }
        ]
      },
      {
        name: 'Unstitched',
        slug: 'unstitched',
        targetGender: 'women',
        categoryType: 'stitch-type',
        stitchType: 'unstitched',
        sortOrder: 2,
        subcategories: [
          {
            name: 'One Piece',
            slug: 'unstitched-one-piece',
            targetGender: 'women',
            categoryType: 'piece-type',
            stitchType: 'unstitched',
            pieceCount: 1,
            sortOrder: 1
          },
          {
            name: 'Two Piece',
            slug: 'unstitched-two-piece',
            targetGender: 'women',
            categoryType: 'piece-type',
            stitchType: 'unstitched',
            pieceCount: 2,
            sortOrder: 2
          },
          {
            name: 'Three Piece',
            slug: 'unstitched-three-piece',
            targetGender: 'women',
            categoryType: 'piece-type',
            stitchType: 'unstitched',
            pieceCount: 3,
            sortOrder: 3
          }
        ]
      }
    ]
  },
  // Kids Categories
  {
    name: 'Kids',
    slug: 'kids',
    targetGender: 'unisex',
    categoryType: 'main',
    level: 0,
    sortOrder: 2,
    subcategories: [
      {
        name: 'Boys',
        slug: 'boys',
        targetGender: 'boys',
        categoryType: 'gender',
        sortOrder: 1,
        subcategories: [
          {
            name: 'Shalwar Kameez',
            slug: 'boys-shalwar-kameez',
            targetGender: 'boys',
            categoryType: 'item-type',
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 1
          },
          {
            name: 'Pants',
            slug: 'boys-pants',
            targetGender: 'boys',
            categoryType: 'item-type',
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 2
          },
          {
            name: 'Trouser',
            slug: 'boys-trouser',
            targetGender: 'boys',
            categoryType: 'item-type',
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 3
          },
          {
            name: 'Shirts',
            slug: 'boys-shirts',
            targetGender: 'boys',
            categoryType: 'item-type',
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 4
          },
          {
            name: 'Pant Shirt Set',
            slug: 'boys-pant-shirt-set',
            targetGender: 'boys',
            categoryType: 'item-type',
            pieceCount: 2,
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 5
          },
          {
            name: 'Trouser Shirt Set',
            slug: 'boys-trouser-shirt-set',
            targetGender: 'boys',
            categoryType: 'item-type',
            pieceCount: 2,
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 6
          }
        ]
      },
      {
        name: 'Girls',
        slug: 'girls',
        targetGender: 'girls',
        categoryType: 'gender',
        sortOrder: 2,
        subcategories: [
          {
            name: 'Shalwar Kameez',
            slug: 'girls-shalwar-kameez',
            targetGender: 'girls',
            categoryType: 'item-type',
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 1
          },
          {
            name: 'Pants',
            slug: 'girls-pants',
            targetGender: 'girls',
            categoryType: 'item-type',
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 2
          },
          {
            name: 'Frock',
            slug: 'girls-frock',
            targetGender: 'girls',
            categoryType: 'item-type',
            sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
            sortOrder: 3
          }
        ]
      }
    ]
  }
];

const collectionData = [
  {
    name: 'Winter Collection',
    slug: 'winter-collection',
    description: 'Warm and cozy winter wear for the whole family',
    season: 'winter',
    sortOrder: 1
  },
  {
    name: 'Summer Collection',
    slug: 'summer-collection',
    description: 'Light and breathable summer clothing',
    season: 'summer',
    sortOrder: 2
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Latest fashion trends and styles',
    season: 'all-season',
    isSpecial: true,
    sortOrder: 3
  }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await CategoryNew.deleteMany({});
    await Collection.deleteMany({});
    console.log('Cleared existing data');

    // Seed collections
    const collections = await Collection.insertMany(collectionData);
    console.log(`Created ${collections.length} collections`);

    // Seed categories recursively
    async function createCategory(categoryData, parentId = null) {
      const { subcategories, ...categoryInfo } = categoryData;
      
      const category = new CategoryNew({
        ...categoryInfo,
        parentCategory: parentId
      });
      
      await category.save();
      console.log(`Created category: ${category.name}`);
      
      if (subcategories && subcategories.length > 0) {
        for (const subCategoryData of subcategories) {
          await createCategory(subCategoryData, category._id);
        }
      }
      
      return category;
    }

    for (const categoryInfo of categoryData) {
      await createCategory(categoryInfo);
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedCategories();