const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

// Ensure environment variables are resolved
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary SDK instance
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
