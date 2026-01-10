/**
 * FLW (Field Level Worker) Routes
 * All routes are public - no authentication required
 */

const express = require('express');
const router = express.Router();

const {
  submitData,
  getSubmissionsByFLW,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  getFLWStats,
  searchFLWData,
} = require('../controllers/flw.controller');

const {
  validate,
  flwDataValidation,
  queryValidation,
} = require('../middleware/validation.middleware');

/**
 * @route   POST /api/v1/flw/submit
 * @desc    Submit FLW data collection
 * @access  Public
 */
router.post('/submit', flwDataValidation.create, validate, submitData);

/**
 * @route   GET /api/v1/flw/submissions/:flwId
 * @desc    Get submissions by FLW ID
 * @access  Public
 */
router.get(
  '/submissions/:flwId',
  queryValidation.pagination,
  validate,
  getSubmissionsByFLW
);

/**
 * @route   GET /api/v1/flw/submission/:id
 * @desc    Get single submission
 * @access  Public
 */
router.get('/submission/:id', getSubmission);

/**
 * @route   PUT /api/v1/flw/submission/:id
 * @desc    Update submission
 * @access  Public
 */
router.put(
  '/submission/:id',
  flwDataValidation.update,
  validate,
  updateSubmission
);

/**
 * @route   DELETE /api/v1/flw/submission/:id
 * @desc    Delete submission
 * @access  Public
 */
router.delete('/submission/:id', deleteSubmission);

/**
 * @route   GET /api/v1/flw/stats/:flwId
 * @desc    Get FLW statistics
 * @access  Public
 */
router.get('/stats/:flwId', getFLWStats);

/**
 * @route   GET /api/v1/flw/search
 * @desc    Search FLW data
 * @access  Public
 */
router.get(
  '/search',
  queryValidation.pagination,
  queryValidation.dateRange,
  validate,
  searchFLWData
);

module.exports = router;
