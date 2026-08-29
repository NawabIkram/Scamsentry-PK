const multer = require('multer');
const path = require('path');

// Configure multer memory storage (no temp files stored on server disk)
const storage = multer.memoryStorage();

// Validate file type (Images only)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

  const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedMimeTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Dangerous or unexpected file format. Only JPEG, JPG, PNG, and WEBP image uploads are permitted.'), false);
  }
};

// Initialize multer middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB Limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
