/**
 * Government Dashboard Routes
 * Protected routes for analytics and reporting
 */

const express = require('express');
const router = express.Router();

const {
  getOverview,
  getBreedDistribution,
  getDiseaseReports,
  getVaccinationCoverage,
  getFLWActivity,
  exportReport,
} = require('../controllers/dashboard.controller');

const { protect, authorize } = require('../middleware/auth.middleware');
const {
  validate,
  queryValidation,
} = require('../middleware/validation.middleware');

// All dashboard routes require authentication and govt/admin role
router.use(protect);
router.use(authorize('admin', 'government'));

/**
 * @route   GET /api/v1/dashboard/overview
 * @desc    Get dashboard overview with key metrics
 * @access  Private (Govt/Admin)
 * @query   state, district, startDate, endDate
 */
router.get('/overview', queryValidation.dateRange, validate, getOverview);

/**
 * @route   GET /api/v1/dashboard/breed-distribution
 * @desc    Get breed distribution analytics
 * @access  Private (Govt/Admin)
 * @query   state, district, startDate, endDate
 */
router.get(
  '/breed-distribution',
  queryValidation.dateRange,
  validate,
  getBreedDistribution
);

/**
 * @route   GET /api/v1/dashboard/disease-reports
 * @desc    Get disease reports and hotspots
 * @access  Private (Govt/Admin)
 * @query   state, district, startDate, endDate
 */
router.get(
  '/disease-reports',
  queryValidation.dateRange,
  validate,
  getDiseaseReports
);

/**
 * @route   GET /api/v1/dashboard/vaccination-coverage
 * @desc    Get vaccination coverage analytics
 * @access  Private (Govt/Admin)
 * @query   state, district, startDate, endDate
 */
router.get(
  '/vaccination-coverage',
  queryValidation.dateRange,
  validate,
  getVaccinationCoverage
);

/**
 * @route   GET /api/v1/dashboard/flw-activity
 * @desc    Get FLW activity analytics
 * @access  Private (Govt/Admin)
 * @query   state, district, startDate, endDate, limit
 */
router.get(
  '/flw-activity',
  queryValidation.dateRange,
  validate,
  getFLWActivity
);

/**
 * @route   GET /api/v1/dashboard/export
 * @desc    Export report data
 * @access  Private (Govt/Admin)
 * @query   type (flw|breed|disease), state, district, startDate, endDate, format (json|csv)
 */
router.get('/export', queryValidation.dateRange, validate, exportReport);

module.exports = router;
