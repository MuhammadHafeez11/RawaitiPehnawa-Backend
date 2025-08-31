import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const clearProductValidation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Drop products collection to clear old validation
    try {
      await mongoose.connection.db.collection('products').drop();
      console.log('Products collection dropped successfully');
    } catch (error) {
      console.log('Products collection not found or already empty');
    }
    
    console.log('Validation cleared. Restart server now.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearProductValidation();