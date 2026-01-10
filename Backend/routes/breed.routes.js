/**
 * Breed Detection Routes
 * All routes are public - no authentication required
 */

const express = require('express');
const router = express.Router();

const {
  detectBreed,
  getBreedAdvisory,
  getAdvisoryByImage,
  getAllBreeds,
  getSupportedLanguages,
  getDetectionHistory,
} = require('../controllers/breed.controller');

const { uploadLimiter } = require('../middleware/rateLimit.middleware');
const {
  uploadSingleImage,
  validateFileExists,
} = require('../middleware/upload.middleware');

/**
 * @route   POST /api/v1/breed/detect
 * @desc    Upload image and detect cattle breed
 * @access  Public
 */
router.post(
  '/detect',
  uploadLimiter,
  uploadSingleImage('image'),
  validateFileExists,
  detectBreed
);

/**
 * @route   GET /api/v1/breed/advisory/:breed
 * @desc    Get breed-specific advisory
 * @access  Public
 * @query   lang - Language code (en, hi, ta, te, mr, gu, kn, pa, bn, or)
 */
router.get('/advisory/:breed', getBreedAdvisory);

/**
 * @route   GET /api/v1/breed/advisory/image/:imageId
 * @desc    Get advisory for a detected image
 * @access  Public
 * @query   lang - Language code
 */
router.get('/advisory/image/:imageId', getAdvisoryByImage);

/**
 * @route   GET /api/v1/breed/list
 * @desc    Get all supported cattle breeds
 * @access  Public
 */
router.get('/list', getAllBreeds);

/**
 * @route   GET /api/v1/breed/languages
 * @desc    Get supported languages for translation
 * @access  Public
 */
router.get('/languages', getSupportedLanguages);

/**
 * @route   GET /api/v1/breed/history
 * @desc    Get detection history
 * @access  Public
 */
router.get('/history', getDetectionHistory);

module.exports = router;
