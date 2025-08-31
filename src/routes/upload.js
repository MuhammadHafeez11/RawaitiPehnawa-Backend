import express from 'express';
import { 
  uploadSingleImage, 
  uploadMultipleImages, 
  deleteImageByPublicId,
  upload 
} from '../controllers/uploadController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All upload routes require admin authentication
router.use(authenticate, requireAdmin);

router.post('/image', upload.single('image'), uploadSingleImage);
router.post('/images', upload.array('images', 10), uploadMultipleImages);
router.delete('/image/:publicId', deleteImageByPublicId);

export default router;