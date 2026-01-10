/**
 * Veterinary Hospital Routes
 */

const express = require('express');
const router = express.Router();

const {
  getAllHospitals,
  getNearbyHospitals,
  getHospitalById,
  addHospital,
  updateHospital,
  deleteHospital,
  getHospitalsByState,
  getEmergencyServices,
} = require('../controllers/veterinary.controller');

const { protect, authorize } = require('../middleware/auth.middleware');
const {
  validate,
  queryValidation,
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/veterinary/hospitals
 * @desc    Get all veterinary hospitals
 * @access  Public
 * @query   state, district, type, page, limit
 */
router.get('/hospitals', queryValidation.pagination, validate, getAllHospitals);

/**
 * @route   GET /api/v1/veterinary/nearby
 * @desc    Get nearby veterinary hospitals
 * @access  Public
 * @query   latitude, longitude, radius (km), type
 */
router.get('/nearby', getNearbyHospitals);

/**
 * @route   GET /api/v1/veterinary/emergency
 * @desc    Get emergency veterinary services
 * @access  Public
 * @query   state, district, latitude, longitude
 */
router.get('/emergency', getEmergencyServices);

/**
 * @route   GET /api/v1/veterinary/by-state/:state
 * @desc    Get hospitals grouped by district in a state
 * @access  Public
 */
router.get('/by-state/:state', getHospitalsByState);

/**
 * @route   GET /api/v1/veterinary/hospital/:id
 * @desc    Get hospital by ID
 * @access  Public
 */
router.get('/hospital/:id', getHospitalById);

/**
 * @route   POST /api/v1/veterinary/hospital
 * @desc    Add new veterinary hospital
 * @access  Private (Admin/Govt only)
 */
router.post(
  '/hospital',
  protect,
  authorize('admin', 'government'),
  addHospital
);

/**
 * @route   PUT /api/v1/veterinary/hospital/:id
 * @desc    Update veterinary hospital
 * @access  Private (Admin/Govt only)
 */
router.put(
  '/hospital/:id',
  protect,
  authorize('admin', 'government'),
  updateHospital
);

/**
 * @route   DELETE /api/v1/veterinary/hospital/:id
 * @desc    Delete veterinary hospital
 * @access  Private (Admin only)
 */
router.delete(
  '/hospital/:id',
  protect,
  authorize('admin'),
  deleteHospital
);

module.exports = router;
