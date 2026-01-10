/**
 * FLW (Field Level Worker) Controller
 * Handles FLW data collection and management
 */

const FLWData = require('../models/FLWData.model');
const CattleImage = require('../models/CattleImage.model');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError, sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Submit FLW data collection
 * @route   POST /api/v1/flw/submit
 * @access  Public (FLW can submit without login)
 */
const submitData = asyncHandler(async (req, res) => {
  const {
    flwId,
    flwName,
    village,
    district,
    state,
    geoLocation,
    farmerName,
    farmerContact,
    cattleBreed,
    cattleAge,
    gender,
    lactationStatus,
    healthIssuesObserved,
    healthNotes,
    vaccinationStatus,
    dateOfVisit,
    cattleImageId,
  } = req.body;

  // If linked to a detected image, get breed info
  let detectedBreed = cattleBreed;
  let breedConfidence = null;

  if (cattleImageId) {
    const image = await CattleImage.findById(cattleImageId);
    if (image && image.detectedBreed) {
      detectedBreed = image.detectedBreed;
      breedConfidence = image.confidence;
    }
  }

  // Create FLW data record
  const flwData = await FLWData.create({
    flwId,
    flwName,
    village,
    district,
    state,
    geoLocation: geoLocation || { latitude: null, longitude: null },
    farmerName: farmerName || '',
    farmerContact: farmerContact || '',
    cattleBreed: detectedBreed,
    cattleAge,
    gender,
    lactationStatus: lactationStatus || 'not-applicable',
    healthIssuesObserved: healthIssuesObserved || [],
    healthNotes: healthNotes || '',
    vaccinationStatus: vaccinationStatus || {},
    dateOfVisit: dateOfVisit || new Date(),
    cattleImageId: cattleImageId || null,
    breedDetectionConfidence: breedConfidence,
  });

  // Link FLW data to image if exists
  if (cattleImageId) {
    await CattleImage.findByIdAndUpdate(cattleImageId, {
      flwDataId: flwData._id,
    });
  }

  sendSuccess(res, 201, {
    id: flwData._id,
    flwId: flwData.flwId,
    cattleBreed: flwData.cattleBreed,
    dateOfVisit: flwData.dateOfVisit,
    submittedAt: flwData.submittedAt,
  }, 'FLW data submitted successfully');
});

/**
 * @desc    Get FLW submissions by FLW ID
 * @route   GET /api/v1/flw/submissions/:flwId
 * @access  Private
 */
const getSubmissionsByFLW = asyncHandler(async (req, res) => {
  const { flwId } = req.params;
  const { page = 1, limit = 20, startDate, endDate } = req.query;

  const query = { flwId };

  // Date range filter
  if (startDate || endDate) {
    query.dateOfVisit = {};
    if (startDate) query.dateOfVisit.$gte = new Date(startDate);
    if (endDate) query.dateOfVisit.$lte = new Date(endDate);
  }

  const submissions = await FLWData.find(query)
    .sort({ dateOfVisit: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('cattleImageId', 'filename detectedBreed confidence');

  const total = await FLWData.countDocuments(query);

  sendSuccess(res, 200, {
    submissions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  }, 'FLW submissions retrieved');
});

/**
 * @desc    Get single FLW submission
 * @route   GET /api/v1/flw/submission/:id
 * @access  Private
 */
const getSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await FLWData.findById(id)
    .populate('cattleImageId', 'filename detectedBreed confidence path');

  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }

  sendSuccess(res, 200, { submission }, 'Submission retrieved successfully');
});

/**
 * @desc    Update FLW submission
 * @route   PUT /api/v1/flw/submission/:id
 * @access  Private
 */
const updateSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await FLWData.findById(id);

  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }

  // Update allowed fields
  const updateFields = [
    'farmerName',
    'farmerContact',
    'cattleAge',
    'gender',
    'lactationStatus',
    'healthIssuesObserved',
    'healthNotes',
    'vaccinationStatus',
  ];

  updateFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      submission[field] = req.body[field];
    }
  });

  await submission.save();

  sendSuccess(res, 200, { submission }, 'Submission updated successfully');
});

/**
 * @desc    Delete FLW submission
 * @route   DELETE /api/v1/flw/submission/:id
 * @access  Private (Admin/Govt only)
 */
const deleteSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await FLWData.findById(id);

  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }

  await submission.deleteOne();

  sendSuccess(res, 200, null, 'Submission deleted successfully');
});

/**
 * @desc    Get FLW statistics
 * @route   GET /api/v1/flw/stats/:flwId
 * @access  Private
 */
const getFLWStats = asyncHandler(async (req, res) => {
  const { flwId } = req.params;

  const stats = await FLWData.aggregate([
    { $match: { flwId } },
    {
      $group: {
        _id: null,
        totalVisits: { $sum: 1 },
        uniqueVillages: { $addToSet: '$village' },
        breedsCovered: { $addToSet: '$cattleBreed' },
        lastVisit: { $max: '$dateOfVisit' },
        firstVisit: { $min: '$dateOfVisit' },
      },
    },
    {
      $project: {
        _id: 0,
        totalVisits: 1,
        uniqueVillagesCount: { $size: '$uniqueVillages' },
        uniqueVillages: 1,
        breedsCoveredCount: { $size: '$breedsCovered' },
        breedsCovered: 1,
        lastVisit: 1,
        firstVisit: 1,
      },
    },
  ]);

  // Get health issues count
  const healthStats = await FLWData.aggregate([
    { $match: { flwId } },
    { $unwind: '$healthIssuesObserved' },
    {
      $group: {
        _id: '$healthIssuesObserved',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  sendSuccess(res, 200, {
    summary: stats[0] || {
      totalVisits: 0,
      uniqueVillagesCount: 0,
      breedsCoveredCount: 0,
    },
    healthIssuesReported: healthStats,
  }, 'FLW statistics retrieved');
});

/**
 * @desc    Search FLW data
 * @route   GET /api/v1/flw/search
 * @access  Private
 */
const searchFLWData = asyncHandler(async (req, res) => {
  const {
    state,
    district,
    village,
    breed,
    healthIssue,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = req.query;

  const query = {};

  if (state) query.state = new RegExp(state, 'i');
  if (district) query.district = new RegExp(district, 'i');
  if (village) query.village = new RegExp(village, 'i');
  if (breed) query.cattleBreed = new RegExp(breed, 'i');
  if (healthIssue) query.healthIssuesObserved = healthIssue;

  if (startDate || endDate) {
    query.dateOfVisit = {};
    if (startDate) query.dateOfVisit.$gte = new Date(startDate);
    if (endDate) query.dateOfVisit.$lte = new Date(endDate);
  }

  const results = await FLWData.find(query)
    .sort({ dateOfVisit: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .select('flwId flwName village district state cattleBreed dateOfVisit healthIssuesObserved');

  const total = await FLWData.countDocuments(query);

  sendSuccess(res, 200, {
    results,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  }, 'Search completed');
});

module.exports = {
  submitData,
  getSubmissionsByFLW,
  getSubmission,
  updateSubmission,
  deleteSubmission,
  getFLWStats,
  searchFLWData,
};
