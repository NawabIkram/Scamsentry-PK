const cloudinary = require('../config/cloudinary');

/**
 * Upload a memory buffer stream to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from Multer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<Object>} Secure URL and Public ID of the uploaded asset
 */
const uploadToCloudinary = (fileBuffer, folder = 'scamsentry_evidence') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    // End stream by writing buffer
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete an asset from Cloudinary
 * @param {string} publicId - The assets public ID on Cloudinary
 * @returns {Promise<Object>} Cloudinary API response
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to clean up Cloudinary asset: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
