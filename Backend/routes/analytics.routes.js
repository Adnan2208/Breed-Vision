/**
 * Analytics Routes
 * All routes are public - no authentication required
 */

const express = require('express');
const router = express.Router();

const {
  getAnalyticsData,
  getKPIsEndpoint,
  getBreedDistributionEndpoint,
  getAccuracyTrendEndpoint,
  getRegionalDataEndpoint,
  getMonthlyDetectionsEndpoint
} = require('../controllers/analytics.controller');

const {
  validate,
  queryValidation,
} = require('../middleware/validation.middleware');

/**
 * @route   GET /api/v1/analytics
 * @desc    Get all analytics data for the analytics page
 * @access  Public
 * @query   startDate, endDate (optional date filters)
 */
router.get('/', queryValidation.dateRange, validate, getAnalyticsData);

/**
 * @route   GET /api/v1/analytics/kpis
 * @desc    Get KPI metrics only
 * @access  Public
 */
router.get('/kpis', getKPIsEndpoint);

/**
 * @route   GET /api/v1/analytics/breed-distribution
 * @desc    Get breed distribution data
 * @access  Public
 */
router.get('/breed-distribution', getBreedDistributionEndpoint);

/**
 * @route   GET /api/v1/analytics/accuracy-trend
 * @desc    Get accuracy trend over time
 * @access  Public
 */
router.get('/accuracy-trend', getAccuracyTrendEndpoint);

/**
 * @route   GET /api/v1/analytics/regional-data
 * @desc    Get regional breed distribution
 * @access  Public
 */
router.get('/regional-data', getRegionalDataEndpoint);

/**
 * @route   GET /api/v1/analytics/monthly-detections
 * @desc    Get monthly detection counts
 * @access  Public
 */
router.get('/monthly-detections', getMonthlyDetectionsEndpoint);

module.exports = router;
