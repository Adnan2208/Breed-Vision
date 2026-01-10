/**
 * Upload Middleware
 * Handles file upload with validation
 */

const upload = require('../config/multer');
const { ApiError } = require('../utils/apiResponse');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Single image upload middleware
 */
const uploadSingleImage = (fieldName = 'image') => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new ApiError(400, 'File too large. Maximum size is 10MB.')
          );
        }
        if (err.message && err.message.includes('Invalid file type')) {
          return next(new ApiError(400, err.message));
        }
        return next(new ApiError(400, err.message || 'File upload failed.'));
      }
      next();
    });
  };
};

/**
 * Multiple images upload middleware
 */
const uploadMultipleImages = (fieldName = 'images', maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new ApiError(400, 'File too large. Maximum size is 10MB per file.')
          );
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(
            new ApiError(400, `Too many files. Maximum ${maxCount} files allowed.`)
          );
        }
        return next(new ApiError(400, err.message || 'File upload failed.'));
      }
      next();
    });
  };
};

/**
 * Validate uploaded file exists
 */
const validateFileExists = (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, 'Please upload an image file.'));
  }
  next();
};

/**
 * Delete uploaded file (cleanup on error)
 */
const deleteUploadedFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  validateFileExists,
  deleteUploadedFile,
};
