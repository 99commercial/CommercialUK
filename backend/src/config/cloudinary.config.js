import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from './env.config.js';

// ✅ Configure cloudinary (do NOT assign to a variable)
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// ✅ Now pass the actual cloudinary instance
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // not cloudinaryConfig
  params: {
    folder: '/properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
  },
});

// Image upload configuration
const uploadImages = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Document upload configuration
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '/documents',
    allowed_formats: ['pdf'],
    resource_type: 'raw'
  },
});

const uploadDocuments = multer({ 
  storage: documentStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for PDFs
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// Upload multiple files to Cloudinary
export const uploadMultipleToCloudinary = async (files, folder = 'properties', resourceType = 'image') => {
  try {
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        // Handle different file formats from multer
        if (file.buffer) {
          // File has buffer (memory storage)
          cloudinary.uploader.upload_stream(
            {
              folder: folder,
              resource_type: resourceType,
              transformation: resourceType === 'image' ? [
                { width: 1920, height: 1080, crop: 'limit' }
              ] : undefined
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file.buffer);
        } else if (file.path) {
          // File has path (CloudinaryStorage)
          cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: resourceType,
            transformation: resourceType === 'image' ? [
              { width: 1920, height: 1080, crop: 'limit' }
            ] : undefined
          }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        } else {
          reject(new Error('File has neither buffer nor path'));
        }
      });
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw error;
  }
};

export default uploadImages;
export { uploadDocuments };