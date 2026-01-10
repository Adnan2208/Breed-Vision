/**
 * Government Dashboard Controller
 * Analytics and reporting for government officials
 * (All endpoints publicly accessible for hackathon demo)
 */

const FLWData = require('../models/FLWData.model');
const CattleImage = require('../models/CattleImage.model');
const VeterinaryHospital = require('../models/VeterinaryHospital.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get dashboard overview
 * @route   GET /api/v1/dashboard/overview
 * @access  Public (Hackathon Demo)
 */
const getOverview = asyncHandler(async (req, res) => {
  const { state, district, startDate, endDate } = req.query;

  // Build date filter
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  // Build location filter
  const locationFilter = {};
  if (state) locationFilter.state = new RegExp(state, 'i');
  if (district) locationFilter.district = new RegExp(district, 'i');

  const flwQuery = { ...locationFilter };
  if (Object.keys(dateFilter).length > 0) {
    flwQuery.dateOfVisit = dateFilter;
  }

  // Get counts
  const [
    totalFLWRecords,
    totalDetections,
    totalHospitals,
  ] = await Promise.all([
    FLWData.countDocuments(flwQuery),
    CattleImage.countDocuments(
      Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
    ),
    VeterinaryHospital.countDocuments({ isActive: true }),
  ]);

  // Get recent activity
  const recentFLWSubmissions = await FLWData.find(flwQuery)
    .sort({ createdAt: -1 })
    .limit(5)
    .select('flwId village district state cattleBreed dateOfVisit');

  sendSuccess(res, 200, {
    summary: {
      totalFLWRecords,
      totalDetections,
      totalHospitals,
    },
    recentActivity: recentFLWSubmissions,
    filters: { state, district, startDate, endDate },
  }, 'Dashboard overview retrieved');
});

/**
 * @desc    Get breed distribution analytics
 * @route   GET /api/v1/dashboard/breed-distribution
 * @access  Public (Hackathon Demo)
 */
const getBreedDistribution = asyncHandler(async (req, res) => {
  const { state, district, startDate, endDate } = req.query;

  const matchStage = {};
  if (state) matchStage.state = new RegExp(state, 'i');
  if (district) matchStage.district = new RegExp(district, 'i');
  if (startDate || endDate) {
    matchStage.dateOfVisit = {};
    if (startDate) matchStage.dateOfVisit.$gte = new Date(startDate);
    if (endDate) matchStage.dateOfVisit.$lte = new Date(endDate);
  }

  // Breed distribution
  const breedDistribution = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$cattleBreed',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$breedDetectionConfidence' },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        breed: '$_id',
        count: 1,
        avgConfidence: { $round: ['$avgConfidence', 2] },
        _id: 0,
      },
    },
  ]);

  // Breed by state
  const breedByState = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { state: '$state', breed: '$cattleBreed' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.state',
        breeds: {
          $push: { breed: '$_id.breed', count: '$count' },
        },
        total: { $sum: '$count' },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        state: '$_id',
        breeds: 1,
        total: 1,
        _id: 0,
      },
    },
  ]);

  // Total breeds
  const totalBreeds = new Set(breedDistribution.map((b) => b.breed)).size;
  const totalRecords = breedDistribution.reduce((sum, b) => sum + b.count, 0);

  sendSuccess(res, 200, {
    summary: {
      totalBreeds,
      totalRecords,
    },
    distribution: breedDistribution,
    byState: breedByState,
  }, 'Breed distribution retrieved');
});

/**
 * @desc    Get disease reports
 * @route   GET /api/v1/dashboard/disease-reports
 * @access  Public (Hackathon Demo)
 */
const getDiseaseReports = asyncHandler(async (req, res) => {
  const { state, district, startDate, endDate } = req.query;

  const matchStage = {
    healthIssuesObserved: { $exists: true, $ne: [] },
  };
  if (state) matchStage.state = new RegExp(state, 'i');
  if (district) matchStage.district = new RegExp(district, 'i');
  if (startDate || endDate) {
    matchStage.dateOfVisit = {};
    if (startDate) matchStage.dateOfVisit.$gte = new Date(startDate);
    if (endDate) matchStage.dateOfVisit.$lte = new Date(endDate);
  }

  // Disease frequency
  const diseaseFrequency = await FLWData.aggregate([
    { $match: matchStage },
    { $unwind: '$healthIssuesObserved' },
    {
      $group: {
        _id: '$healthIssuesObserved',
        count: { $sum: 1 },
        affectedDistricts: { $addToSet: '$district' },
        affectedStates: { $addToSet: '$state' },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        disease: '$_id',
        count: 1,
        affectedDistrictsCount: { $size: '$affectedDistricts' },
        affectedStatesCount: { $size: '$affectedStates' },
        _id: 0,
      },
    },
  ]);

  // Disease by breed
  const diseaseByBreed = await FLWData.aggregate([
    { $match: matchStage },
    { $unwind: '$healthIssuesObserved' },
    {
      $group: {
        _id: { disease: '$healthIssuesObserved', breed: '$cattleBreed' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.disease',
        affectedBreeds: {
          $push: { breed: '$_id.breed', count: '$count' },
        },
        total: { $sum: '$count' },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 10 },
  ]);

  // Disease hotspots (top districts with health issues)
  const hotspots = await FLWData.aggregate([
    { $match: matchStage },
    { $unwind: '$healthIssuesObserved' },
    {
      $group: {
        _id: { state: '$state', district: '$district' },
        totalCases: { $sum: 1 },
        diseases: { $addToSet: '$healthIssuesObserved' },
      },
    },
    { $sort: { totalCases: -1 } },
    { $limit: 10 },
    {
      $project: {
        state: '$_id.state',
        district: '$_id.district',
        totalCases: 1,
        diseasesCount: { $size: '$diseases' },
        diseases: 1,
        _id: 0,
      },
    },
  ]);

  sendSuccess(res, 200, {
    diseaseFrequency,
    diseaseByBreed,
    hotspots,
  }, 'Disease reports retrieved');
});

/**
 * @desc    Get vaccination coverage
 * @route   GET /api/v1/dashboard/vaccination-coverage
 * @access  Public (Hackathon Demo)
 */
const getVaccinationCoverage = asyncHandler(async (req, res) => {
  const { state, district, startDate, endDate } = req.query;

  const matchStage = {};
  if (state) matchStage.state = new RegExp(state, 'i');
  if (district) matchStage.district = new RegExp(district, 'i');
  if (startDate || endDate) {
    matchStage.dateOfVisit = {};
    if (startDate) matchStage.dateOfVisit.$gte = new Date(startDate);
    if (endDate) matchStage.dateOfVisit.$lte = new Date(endDate);
  }

  // FMD Vaccination coverage
  const fmdCoverage = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        vaccinated: {
          $sum: { $cond: ['$vaccinationStatus.fmd.done', 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        vaccinated: 1,
        percentage: {
          $round: [{ $multiply: [{ $divide: ['$vaccinated', '$total'] }, 100] }, 2],
        },
      },
    },
  ]);

  // HS Vaccination coverage
  const hsCoverage = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        vaccinated: {
          $sum: { $cond: ['$vaccinationStatus.hs.done', 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        vaccinated: 1,
        percentage: {
          $round: [{ $multiply: [{ $divide: ['$vaccinated', '$total'] }, 100] }, 2],
        },
      },
    },
  ]);

  // BQ Vaccination coverage
  const bqCoverage = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        vaccinated: {
          $sum: { $cond: ['$vaccinationStatus.bq.done', 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        vaccinated: 1,
        percentage: {
          $round: [{ $multiply: [{ $divide: ['$vaccinated', '$total'] }, 100] }, 2],
        },
      },
    },
  ]);

  // Coverage by state
  const coverageByState = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$state',
        total: { $sum: 1 },
        fmdVaccinated: { $sum: { $cond: ['$vaccinationStatus.fmd.done', 1, 0] } },
        hsVaccinated: { $sum: { $cond: ['$vaccinationStatus.hs.done', 1, 0] } },
        bqVaccinated: { $sum: { $cond: ['$vaccinationStatus.bq.done', 1, 0] } },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        state: '$_id',
        total: 1,
        fmd: {
          count: '$fmdVaccinated',
          percentage: {
            $round: [{ $multiply: [{ $divide: ['$fmdVaccinated', '$total'] }, 100] }, 2],
          },
        },
        hs: {
          count: '$hsVaccinated',
          percentage: {
            $round: [{ $multiply: [{ $divide: ['$hsVaccinated', '$total'] }, 100] }, 2],
          },
        },
        bq: {
          count: '$bqVaccinated',
          percentage: {
            $round: [{ $multiply: [{ $divide: ['$bqVaccinated', '$total'] }, 100] }, 2],
          },
        },
        _id: 0,
      },
    },
  ]);

  sendSuccess(res, 200, {
    overall: {
      fmd: fmdCoverage[0] || { total: 0, vaccinated: 0, percentage: 0 },
      hs: hsCoverage[0] || { total: 0, vaccinated: 0, percentage: 0 },
      bq: bqCoverage[0] || { total: 0, vaccinated: 0, percentage: 0 },
    },
    byState: coverageByState,
  }, 'Vaccination coverage retrieved');
});

/**
 * @desc    Get FLW activity analytics
 * @route   GET /api/v1/dashboard/flw-activity
 * @access  Public (Hackathon Demo)
 */
const getFLWActivity = asyncHandler(async (req, res) => {
  const { state, district, startDate, endDate, limit = 20 } = req.query;

  const matchStage = {};
  if (state) matchStage.state = new RegExp(state, 'i');
  if (district) matchStage.district = new RegExp(district, 'i');
  if (startDate || endDate) {
    matchStage.dateOfVisit = {};
    if (startDate) matchStage.dateOfVisit.$gte = new Date(startDate);
    if (endDate) matchStage.dateOfVisit.$lte = new Date(endDate);
  }

  // Top performing FLWs
  const topFLWs = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { flwId: '$flwId', flwName: '$flwName' },
        totalVisits: { $sum: 1 },
        uniqueVillages: { $addToSet: '$village' },
        uniqueDistricts: { $addToSet: '$district' },
        lastVisit: { $max: '$dateOfVisit' },
      },
    },
    { $sort: { totalVisits: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        flwId: '$_id.flwId',
        flwName: '$_id.flwName',
        totalVisits: 1,
        villagesCovered: { $size: '$uniqueVillages' },
        districtsCovered: { $size: '$uniqueDistricts' },
        lastVisit: 1,
        _id: 0,
      },
    },
  ]);

  // Daily activity trend
  const dailyActivity = await FLWData.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$dateOfVisit' },
        },
        submissions: { $sum: 1 },
        uniqueFLWs: { $addToSet: '$flwId' },
      },
    },
    { $sort: { _id: -1 } },
    { $limit: 30 },
    {
      $project: {
        date: '$_id',
        submissions: 1,
        activeFLWs: { $size: '$uniqueFLWs' },
        _id: 0,
      },
    },
  ]);

  // Total unique FLWs
  const uniqueFLWs = await FLWData.distinct('flwId', matchStage);

  sendSuccess(res, 200, {
    summary: {
      totalUniqueFLWs: uniqueFLWs.length,
    },
    topPerformers: topFLWs,
    dailyTrend: dailyActivity.reverse(),
  }, 'FLW activity retrieved');
});

/**
 * @desc    Export report data
 * @route   GET /api/v1/dashboard/export
 * @access  Public (Hackathon Demo)
 */
const exportReport = asyncHandler(async (req, res) => {
  const { type, state, district, startDate, endDate, format = 'json' } = req.query;

  const matchStage = {};
  if (state) matchStage.state = new RegExp(state, 'i');
  if (district) matchStage.district = new RegExp(district, 'i');
  if (startDate || endDate) {
    matchStage.dateOfVisit = {};
    if (startDate) matchStage.dateOfVisit.$gte = new Date(startDate);
    if (endDate) matchStage.dateOfVisit.$lte = new Date(endDate);
  }

  let data;

  switch (type) {
    case 'flw':
      data = await FLWData.find(matchStage)
        .select('-__v')
        .sort({ dateOfVisit: -1 });
      break;

    case 'breed':
      data = await FLWData.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { state: '$state', district: '$district', breed: '$cattleBreed' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);
      break;

    case 'disease':
      data = await FLWData.aggregate([
        { $match: { ...matchStage, healthIssuesObserved: { $ne: [] } } },
        { $unwind: '$healthIssuesObserved' },
        {
          $group: {
            _id: {
              state: '$state',
              district: '$district',
              disease: '$healthIssuesObserved',
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);
      break;

    default:
      data = await FLWData.find(matchStage).select('-__v').limit(1000);
  }

  if (format === 'csv') {
    // Convert to CSV format
    const csvData = convertToCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=report_${type}_${Date.now()}.csv`);
    return res.send(csvData);
  }

  sendSuccess(res, 200, {
    type,
    recordCount: data.length,
    data,
  }, 'Report data exported');
});

/**
 * Helper function to convert data to CSV
 */
function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? `${prefix}_` : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k]) && !(obj[k] instanceof Date)) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const flatData = data.map((item) => 
    flattenObject(item.toObject ? item.toObject() : item)
  );

  const headers = [...new Set(flatData.flatMap(Object.keys))];
  const csvRows = [headers.join(',')];

  for (const row of flatData) {
    const values = headers.map((header) => {
      const val = row[header];
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
      return val;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

module.exports = {
  getOverview,
  getBreedDistribution,
  getDiseaseReports,
  getVaccinationCoverage,
  getFLWActivity,
  exportReport,
};
