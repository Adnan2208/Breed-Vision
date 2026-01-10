/**
 * Analytics Controller
 * Provides analytics data from MongoDB for the frontend dashboard
 */

const FLWData = require('../models/FLWData.model');
const CattleImage = require('../models/CattleImage.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get all analytics data for the analytics page
 * @route   GET /api/v1/analytics
 * @access  Public
 */
const getAnalyticsData = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const flwDateFilter = Object.keys(dateFilter).length > 0 ? { dateOfVisit: dateFilter } : {};
  const imageDataFilter = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

  // Get all analytics data in parallel
  const [
    kpis,
    breedDistribution,
    accuracyOverTime,
    regionalData,
    monthlyDetections
  ] = await Promise.all([
    getKPIs(flwDateFilter, imageDataFilter),
    getBreedDistribution(flwDateFilter),
    getAccuracyOverTime(imageDataFilter),
    getRegionalData(flwDateFilter),
    getMonthlyDetections(imageDataFilter)
  ]);

  sendSuccess(res, 200, {
    kpis,
    breedDistribution,
    accuracyOverTime,
    regionalData,
    monthlyDetections
  }, 'Analytics data retrieved successfully');
});

/**
 * @desc    Get KPI metrics
 * @route   GET /api/v1/analytics/kpis
 * @access  Public
 */
const getKPIsEndpoint = asyncHandler(async (req, res) => {
  const kpis = await getKPIs({}, {});
  sendSuccess(res, 200, kpis, 'KPIs retrieved successfully');
});

/**
 * @desc    Get breed distribution
 * @route   GET /api/v1/analytics/breed-distribution
 * @access  Public
 */
const getBreedDistributionEndpoint = asyncHandler(async (req, res) => {
  const distribution = await getBreedDistribution({});
  sendSuccess(res, 200, distribution, 'Breed distribution retrieved successfully');
});

/**
 * @desc    Get accuracy over time
 * @route   GET /api/v1/analytics/accuracy-trend
 * @access  Public
 */
const getAccuracyTrendEndpoint = asyncHandler(async (req, res) => {
  const accuracyTrend = await getAccuracyOverTime({});
  sendSuccess(res, 200, accuracyTrend, 'Accuracy trend retrieved successfully');
});

/**
 * @desc    Get regional breed data
 * @route   GET /api/v1/analytics/regional-data
 * @access  Public
 */
const getRegionalDataEndpoint = asyncHandler(async (req, res) => {
  const regionalData = await getRegionalData({});
  sendSuccess(res, 200, regionalData, 'Regional data retrieved successfully');
});

/**
 * @desc    Get monthly detections
 * @route   GET /api/v1/analytics/monthly-detections
 * @access  Public
 */
const getMonthlyDetectionsEndpoint = asyncHandler(async (req, res) => {
  const monthlyDetections = await getMonthlyDetections({});
  sendSuccess(res, 200, monthlyDetections, 'Monthly detections retrieved successfully');
});

// ============ Helper Functions ============

/**
 * Get KPI metrics
 */
async function getKPIs(flwDateFilter, imageDataFilter) {
  const [
    totalImagesProcessed,
    breedCounts,
    avgConfidenceResult,
    accuracyStats
  ] = await Promise.all([
    // Total images processed
    CattleImage.countDocuments(imageDataFilter),
    
    // Most detected breed
    FLWData.aggregate([
      { $match: flwDateFilter },
      { $group: { _id: '$cattleBreed', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]),
    
    // Average confidence
    CattleImage.aggregate([
      { $match: { ...imageDataFilter, confidence: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
    ]),
    
    // Model accuracy (based on detections with high confidence)
    CattleImage.aggregate([
      { $match: { ...imageDataFilter, confidence: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: null,
          totalDetections: { $sum: 1 },
          highConfidenceDetections: {
            $sum: { $cond: [{ $gte: ['$confidence', 0.8] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  const mostDetectedBreed = breedCounts[0]?._id || 'N/A';
  const mostDetectedBreedCount = breedCounts[0]?.count || 0;
  const avgConfidence = avgConfidenceResult[0]?.avgConfidence 
    ? Math.round(avgConfidenceResult[0].avgConfidence * 100 * 10) / 10 
    : 0;
  
  const modelAccuracy = accuracyStats[0]?.totalDetections > 0
    ? Math.round((accuracyStats[0].highConfidenceDetections / accuracyStats[0].totalDetections) * 100 * 10) / 10
    : 0;

  return {
    totalImagesProcessed,
    mostDetectedBreed,
    mostDetectedBreedCount,
    avgConfidence,
    modelAccuracy
  };
}

/**
 * Get breed distribution data
 */
async function getBreedDistribution(flwDateFilter) {
  const distribution = await FLWData.aggregate([
    { $match: flwDateFilter },
    { $group: { _id: '$cattleBreed', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  return distribution.map(item => ({
    breed: item._id || 'Unknown',
    count: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 100 * 10) / 10 : 0
  }));
}

/**
 * Get accuracy/confidence over time (monthly)
 */
async function getAccuracyOverTime(imageDataFilter) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const trend = await CattleImage.aggregate([
    { 
      $match: { 
        ...imageDataFilter,
        createdAt: { $gte: sixMonthsAgo },
        confidence: { $exists: true, $ne: null }
      } 
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        avgAccuracy: { $avg: '$confidence' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return trend.map(item => ({
    month: monthNames[item._id.month - 1],
    accuracy: Math.round(item.avgAccuracy * 100 * 10) / 10
  }));
}

/**
 * Get regional breed data (state-wise)
 */
async function getRegionalData(flwDateFilter) {
  const regionalBreedData = await FLWData.aggregate([
    { $match: flwDateFilter },
    {
      $group: {
        _id: { state: '$state', breed: '$cattleBreed' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.state',
        breeds: { $push: { breed: '$_id.breed', count: '$count' } },
        total: { $sum: '$count' }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 10 }
  ]);

  // Transform into format suitable for charts
  // Get all unique breeds
  const allBreeds = new Set();
  regionalBreedData.forEach(region => {
    region.breeds.forEach(b => allBreeds.add(b.breed));
  });

  // Create normalized data structure for each region
  return regionalBreedData.map(region => {
    const result = { region: region._id || 'Unknown' };
    
    // Initialize all breeds with 0
    allBreeds.forEach(breed => {
      const breedKey = breed?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
      result[breedKey] = 0;
    });
    
    // Fill in actual counts
    region.breeds.forEach(b => {
      const breedKey = b.breed?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
      result[breedKey] = b.count;
    });
    
    return result;
  });
}

/**
 * Get monthly detection counts
 */
async function getMonthlyDetections(imageDataFilter) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const detections = await CattleImage.aggregate([
    { 
      $match: { 
        ...imageDataFilter,
        createdAt: { $gte: sixMonthsAgo }
      } 
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        detections: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return detections.map(item => ({
    month: monthNames[item._id.month - 1],
    detections: item.detections
  }));
}

module.exports = {
  getAnalyticsData,
  getKPIsEndpoint,
  getBreedDistributionEndpoint,
  getAccuracyTrendEndpoint,
  getRegionalDataEndpoint,
  getMonthlyDetectionsEndpoint
};
