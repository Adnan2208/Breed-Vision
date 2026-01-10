/**
 * Veterinary Hospital Routes
 * All routes are public - no authentication required
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
 * @access  Public
 */
router.post('/hospital', addHospital);

/**
 * @route   PUT /api/v1/veterinary/hospital/:id
 * @desc    Update veterinary hospital
 * @access  Public
 */
router.put('/hospital/:id', updateHospital);

/**
 * @route   DELETE /api/v1/veterinary/hospital/:id
 * @desc    Delete veterinary hospital
 * @access  Public
 */
router.delete('/hospital/:id', deleteHospital);

module.exports = router;
