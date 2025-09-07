import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    url: String,
    publicId: String
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoryNew',
    default: null
  },
  level: {
    type: Number,
    default: 0 // 0: Main, 1: Sub, 2: Sub-sub
  },
  categoryPath: {
    type: String, // e.g., "women/stitched/two-piece"
    default: ''
  },
  categoryType: {
    type: String,
    enum: ['main', 'gender', 'stitch-type', 'piece-type', 'item-type'],
    default: 'main'
  },
  stitchType: {
    type: String,
    enum: ['stitched', 'unstitched', 'both'],
    default: 'both'
  },
  pieceCount: {
    type: Number,
    enum: [1, 2, 3],
    default: null
  },
  targetGender: {
    type: String,
    enum: ['women', 'men', 'boys', 'girls', 'unisex'],
    default: 'unisex'
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '0-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate categoryPath
categorySchema.pre('save', async function(next) {
  if (this.parentCategory) {
    const parent = await this.constructor.findById(this.parentCategory);
    if (parent) {
      this.categoryPath = parent.categoryPath ? `${parent.categoryPath}/${this.slug}` : this.slug;
      this.level = parent.level + 1;
    }
  } else {
    this.categoryPath = this.slug;
    this.level = 0;
  }
  next();
});

// Create indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ categoryPath: 1 });
categorySchema.index({ targetGender: 1 });
categorySchema.index({ stitchType: 1 });

export default mongoose.model('CategoryNew', categorySchema);