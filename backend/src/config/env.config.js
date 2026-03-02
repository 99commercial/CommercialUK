import dotenv from 'dotenv';

dotenv.config();

// DATABASE CONNECTION VARIABLES
export const MONGO_URI = process.env.MONGO_URI
export const PORT = process.env.PORT

// JWT CONFIGURATION
export const JWT_SECRET=process.env.JWT_SECRET
export const JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET
export const JWT_EXPIRES_IN=process.env.JWT_EXPIRES_IN
export const JWT_REFRESH_EXPIRES_IN=process.env.JWT_REFRESH_EXPIRES_IN

// EMAIL CONFIGURATION - Brevo SMTP
export const EMAIL_PASS = process.env.EMAIL_PASS
export const EMAIL_USER = process.env.EMAIL_USER

// FRONTEND URL
export const FRONTEND_URL = process.env.FRONTEND_URL

// CLOUDINARY CONFIGURATION
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

// PATMA API CONFIGURATION
export const PATMA_API_TOKEN = process.env.PATMA_API_TOKEN
export const PATMA_URL = process.env.PATMA_URL
export const OPENPOSTCODES_API_KEY = process.env.OPENPOSTCODES_API_KEY
export const OPENROUTERAPIKEY = process.env.OPENROUTERAPIKEY
export const OPENROUTER_URL = process.env.OPENROUTER_URL
export const OPENPOSTCODES_URL = process.env.OPENPOSTCODES_URL

// STRIPE CONFIGURATION
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY