import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '0-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y']
  },
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    min: 0
  },
  sku: {
    type: String
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoryNew'
  }],
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection'
  }],
  stitchType: {
    type: String,
    enum: ['stitched', 'unstitched'],
    required: true
  },
  pieceCount: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  targetGender: {
    type: String,
    enum: ['women', 'men', 'boys', 'girls'],
    required: true
  },
  season: {
    type: String,
    enum: ['winter', 'summer', 'all-season'],
    default: 'all-season'
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    publicId: {
      type: String // Cloudinary public ID for deletion
    }
  }],
  variants: [variantSchema],
  colors: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  materials: [{
    type: String,
    trim: true
  }],
  careInstructions: {
    type: String,
    maxlength: [1000, 'Care instructions cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  totalStock: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create unique slug from name before saving
productSchema.pre('save', async function(next) {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check if slug already exists
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  // Calculate total stock from variants or use manual stock
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
  } else {
    // Use manual stock field for products without variants
    this.totalStock = this.stock || 0;
  }
  
  next();
});

// Virtual for current price (discounted price if available, otherwise regular price)
productSchema.virtual('currentPrice').get(function() {
  return this.discountedPrice && this.discountedPrice < this.price ? this.discountedPrice : this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountedPrice && this.discountedPrice < this.price) {
    return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for has discount
productSchema.virtual('hasDiscount').get(function() {
  return this.discountedPrice && this.discountedPrice < this.price;
});

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  return this.isActive && (this.totalStock > 0 || this.stock > 0);
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  const currentStock = this.variants && this.variants.length > 0 ? this.totalStock : this.stock;
  if (currentStock > 10) return 'In Stock';
  if (currentStock > 0) return `Only ${currentStock} left`;
  return 'Out of Stock';
});

// Virtual for current stock
productSchema.virtual('currentStock').get(function() {
  return this.variants && this.variants.length > 0 ? this.totalStock : this.stock;
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ categories: 1, isActive: 1 });
productSchema.index({ collections: 1 });
productSchema.index({ stitchType: 1 });
productSchema.index({ pieceCount: 1 });
productSchema.index({ targetGender: 1 });
productSchema.index({ season: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'rating.average': -1 });

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);