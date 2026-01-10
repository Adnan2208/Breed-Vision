/**
 * Breed Detection Controller
 * Handles image upload and breed detection via Roboflow YOLO API
 */

const CattleImage = require('../models/CattleImage.model');
const roboflowService = require('../services/roboflow.service');
const translateService = require('../services/translate.service');
const { getAdvisory, getTranslation } = require('../config/advisory');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError, sendSuccess } = require('../utils/apiResponse');
const { deleteUploadedFile } = require('../middleware/upload.middleware');
const path = require('path');

/**
 * @desc    Upload image and detect cattle breed
 * @route   POST /api/v1/breed/detect
 * @access  Public
 */
const detectBreed = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image file');
  }

  const imagePath = req.file.path;

  try {
    // Call Roboflow API for breed detection
    const detectionResult = await roboflowService.detectBreed(imagePath);

    // Save image record to database
    const cattleImage = await CattleImage.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: imagePath,
      mimetype: req.file.mimetype,
      size: req.file.size,
      detectedBreed: detectionResult.breed,
      confidence: detectionResult.confidence,
      detectionResponse: detectionResult.rawResponse,
      uploadedBy: 'public',
    });

    // Prepare response
    const response = {
      imageId: cattleImage._id,
      filename: cattleImage.filename,
      detection: {
        detected: detectionResult.detected,
        breed: detectionResult.breed,
        confidence: detectionResult.confidence,
        allPredictions: detectionResult.allPredictions || [],
      },
    };

    // If breed detected, include basic advisory info
    if (detectionResult.detected && detectionResult.breed) {
      const advisory = getAdvisory(detectionResult.breed);
      response.advisory = {
        breed: advisory.breed,
        origin: advisory.origin,
        milkYield: advisory.milkYield,
      };
    }

    sendSuccess(res, 200, response, 'Breed detection completed');
  } catch (error) {
    // Clean up uploaded file on error
    deleteUploadedFile(imagePath);
    throw error;
  }
});

/**
 * @desc    Get breed advisory information
 * @route   GET /api/v1/breed/advisory/:breed
 * @access  Public
 */
const getBreedAdvisory = asyncHandler(async (req, res) => {
  const { breed } = req.params;
  const { lang = 'en' } = req.query;

  if (!breed) {
    throw new ApiError(400, 'Breed name is required');
  }

  // Get advisory data
  let advisory = getAdvisory(breed);
  const labels = getTranslation(lang);

  // Translate if not English
  if (lang !== 'en') {
    advisory = await translateService.translateAdvisory(advisory, lang);
  }

  sendSuccess(res, 200, {
    breed: advisory.breed,
    origin: advisory.origin,
    feedQuantity: advisory.feedQuantity,
    feedType: advisory.feedType,
    healthImmunity: advisory.healthImmunity,
    diseaseRisks: advisory.diseaseRisks,
    vaccines: advisory.vaccines,
    rgmMedicines: advisory.rgmMedicines,
    milkYield: advisory.milkYield,
    specialCare: advisory.specialCare,
    labels,
    language: lang,
  }, 'Advisory retrieved successfully');
});

/**
 * @desc    Get advisory for detected image
 * @route   GET /api/v1/breed/advisory/image/:imageId
 * @access  Public
 */
const getAdvisoryByImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  const { lang = 'en' } = req.query;

  const cattleImage = await CattleImage.findById(imageId);

  if (!cattleImage) {
    throw new ApiError(404, 'Image not found');
  }

  if (!cattleImage.detectedBreed) {
    throw new ApiError(400, 'No breed was detected for this image');
  }

  let advisory = getAdvisory(cattleImage.detectedBreed);
  const labels = getTranslation(lang);

  if (lang !== 'en') {
    advisory = await translateService.translateAdvisory(advisory, lang);
  }

  sendSuccess(res, 200, {
    imageId: cattleImage._id,
    detectedBreed: cattleImage.detectedBreed,
    confidence: cattleImage.confidence,
    advisory: {
      breed: advisory.breed,
      origin: advisory.origin,
      feedQuantity: advisory.feedQuantity,
      feedType: advisory.feedType,
      healthImmunity: advisory.healthImmunity,
      diseaseRisks: advisory.diseaseRisks,
      vaccines: advisory.vaccines,
      rgmMedicines: advisory.rgmMedicines,
      milkYield: advisory.milkYield,
      specialCare: advisory.specialCare,
    },
    labels,
    language: lang,
  }, 'Advisory retrieved successfully');
});

/**
 * @desc    Get all supported breeds
 * @route   GET /api/v1/breed/list
 * @access  Public
 */
const getAllBreeds = asyncHandler(async (req, res) => {
  const { breedAdvisory } = require('../config/advisory');

  const breeds = Object.keys(breedAdvisory)
    .filter((key) => key !== 'default')
    .map((key) => ({
      id: key,
      name: breedAdvisory[key].breed,
      origin: breedAdvisory[key].origin,
    }));

  sendSuccess(res, 200, { breeds }, 'Breeds list retrieved successfully');
});

/**
 * @desc    Get supported languages for translation
 * @route   GET /api/v1/breed/languages
 * @access  Public
 */
const getSupportedLanguages = asyncHandler(async (req, res) => {
  const languages = translateService.getSupportedLanguages();

  sendSuccess(res, 200, { languages }, 'Supported languages retrieved');
});

/**
 * @desc    Get detection history
 * @route   GET /api/v1/breed/history
 * @access  Public
 */
const getDetectionHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const images = await CattleImage.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select('filename detectedBreed confidence createdAt');

  const total = await CattleImage.countDocuments();

  sendSuccess(res, 200, {
    images,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  }, 'Detection history retrieved');
});

module.exports = {
  detectBreed,
  getBreedAdvisory,
  getAdvisoryByImage,
  getAllBreeds,
  getSupportedLanguages,
  getDetectionHistory,
};
