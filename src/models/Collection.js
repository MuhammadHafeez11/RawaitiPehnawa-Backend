import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
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
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  season: {
    type: String,
    enum: ['winter', 'summer', 'all-season'],
    default: 'all-season'
  },
  isSpecial: {
    type: Boolean,
    default: false // For New Arrivals, Featured, etc.
  }
}, {
  timestamps: true
});

// Create indexes
collectionSchema.index({ slug: 1 });
collectionSchema.index({ isActive: 1 });
collectionSchema.index({ sortOrder: 1 });

export default mongoose.model('Collection', collectionSchema);