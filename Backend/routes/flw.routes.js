/**
 * FLW (Field Level Worker) Routes
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

const { protect, authorize } = require('../middleware/auth.middleware');
const {
  validate,
  flwDataValidation,
  queryValidation,
} = require('../middleware/validation.middleware');

/**
 * @route   POST /api/v1/flw/submit
 * @desc    Submit FLW data collection
 * @access  Public (FLW can submit without login)
 */
router.post('/submit', flwDataValidation.create, validate, submitData);

/**
 * @route   GET /api/v1/flw/submissions/:flwId
 * @desc    Get submissions by FLW ID
 * @access  Private
 */
router.get(
  '/submissions/:flwId',
  protect,
  queryValidation.pagination,
  validate,
  getSubmissionsByFLW
);

/**
 * @route   GET /api/v1/flw/submission/:id
 * @desc    Get single submission
 * @access  Private
 */
router.get('/submission/:id', protect, getSubmission);

/**
 * @route   PUT /api/v1/flw/submission/:id
 * @desc    Update submission
 * @access  Private
 */
router.put(
  '/submission/:id',
  protect,
  flwDataValidation.update,
  validate,
  updateSubmission
);

/**
 * @route   DELETE /api/v1/flw/submission/:id
 * @desc    Delete submission
 * @access  Private (Admin/Govt only)
 */
router.delete(
  '/submission/:id',
  protect,
  authorize('admin', 'government'),
  deleteSubmission
);

/**
 * @route   GET /api/v1/flw/stats/:flwId
 * @desc    Get FLW statistics
 * @access  Private
 */
router.get('/stats/:flwId', protect, getFLWStats);

/**
 * @route   GET /api/v1/flw/search
 * @desc    Search FLW data
 * @access  Private
 */
router.get(
  '/search',
  protect,
  queryValidation.pagination,
  queryValidation.dateRange,
  validate,
  searchFLWData
);

module.exports = router;
