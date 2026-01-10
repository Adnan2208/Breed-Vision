/**
 * Government Dashboard Routes
 * All routes are public - no authentication required
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

const {
  validate,
  queryValidation,
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/dashboard/overview
 * @desc    Get dashboard overview with key metrics
 * @access  Public
 * @query   state, district, startDate, endDate
 */
router.get('/overview', queryValidation.dateRange, validate, getOverview);

/**
 * @route   GET /api/v1/dashboard/breed-distribution
 * @desc    Get breed distribution analytics
 * @access  Public
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
 * @access  Public
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
 * @access  Public
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
 * @access  Public
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
 * @access  Public
 * @query   type (flw|breed|disease), state, district, startDate, endDate, format (json|csv)
 */
router.get('/export', queryValidation.dateRange, validate, exportReport);

module.exports = router;
