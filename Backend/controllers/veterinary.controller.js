/**
 * Veterinary Hospital Controller
 * Handles veterinary hospital data and location-based queries
 */

const VeterinaryHospital = require('../models/VeterinaryHospital.model');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError, sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get all veterinary hospitals
 * @route   GET /api/v1/veterinary/hospitals
 * @access  Public
 */
const getAllHospitals = asyncHandler(async (req, res) => {
  const { state, district, type, page = 1, limit = 20 } = req.query;

  const query = { isActive: true };

  if (state) query['address.state'] = new RegExp(state, 'i');
  if (district) query['address.district'] = new RegExp(district, 'i');
  if (type) query.type = type;

  const hospitals = await VeterinaryHospital.find(query)
    .sort({ 'address.state': 1, 'address.district': 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await VeterinaryHospital.countDocuments(query);

  sendSuccess(res, 200, {
    hospitals,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  }, 'Hospitals retrieved successfully');
});

/**
 * @desc    Get nearby veterinary hospitals
 * @route   GET /api/v1/veterinary/nearby
 * @access  Public
 */
const getNearbyHospitals = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 50, type } = req.query;

  if (!latitude || !longitude) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const query = {
    isActive: true,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseInt(radius) * 1000, // Convert km to meters
      },
    },
  };

  if (type) query.type = type;

  const hospitals = await VeterinaryHospital.find(query).limit(20);

  // Calculate distance for each hospital
  const hospitalsWithDistance = hospitals.map((hospital) => {
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      hospital.location.coordinates[1],
      hospital.location.coordinates[0]
    );

    return {
      ...hospital.toObject(),
      distance: Math.round(distance * 100) / 100, // km
    };
  });

  sendSuccess(res, 200, {
    hospitals: hospitalsWithDistance,
    searchLocation: { latitude, longitude },
    searchRadius: `${radius} km`,
  }, 'Nearby hospitals retrieved');
});

/**
 * @desc    Get hospital by ID
 * @route   GET /api/v1/veterinary/hospital/:id
 * @access  Public
 */
const getHospitalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await VeterinaryHospital.findById(id);

  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  sendSuccess(res, 200, { hospital }, 'Hospital retrieved successfully');
});

/**
 * @desc    Add new veterinary hospital
 * @route   POST /api/v1/veterinary/hospital
 * @access  Public
 */
const addHospital = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    address,
    location,
    contact,
    services,
    timings,
    facilities,
    incharge,
  } = req.body;

  const hospital = await VeterinaryHospital.create({
    name,
    type: type || 'government',
    address,
    location: {
      type: 'Point',
      coordinates: location.coordinates,
    },
    contact,
    services: services || [],
    timings: timings || {},
    facilities: facilities || [],
    incharge: incharge || {},
  });

  sendSuccess(res, 201, { hospital }, 'Hospital added successfully');
});

/**
 * @desc    Update veterinary hospital
 * @route   PUT /api/v1/veterinary/hospital/:id
 * @access  Public
 */
const updateHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let hospital = await VeterinaryHospital.findById(id);

  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  hospital = await VeterinaryHospital.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, 200, { hospital }, 'Hospital updated successfully');
});

/**
 * @desc    Delete veterinary hospital
 * @route   DELETE /api/v1/veterinary/hospital/:id
 * @access  Public
 */
const deleteHospital = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await VeterinaryHospital.findById(id);

  if (!hospital) {
    throw new ApiError(404, 'Hospital not found');
  }

  await hospital.deleteOne();

  sendSuccess(res, 200, null, 'Hospital deleted successfully');
});

/**
 * @desc    Get hospitals by state
 * @route   GET /api/v1/veterinary/by-state/:state
 * @access  Public
 */
const getHospitalsByState = asyncHandler(async (req, res) => {
  const { state } = req.params;

  const hospitals = await VeterinaryHospital.find({
    'address.state': new RegExp(state, 'i'),
    isActive: true,
  }).sort({ 'address.district': 1 });

  // Group by district
  const groupedByDistrict = hospitals.reduce((acc, hospital) => {
    const district = hospital.address.district;
    if (!acc[district]) {
      acc[district] = [];
    }
    acc[district].push(hospital);
    return acc;
  }, {});

  sendSuccess(res, 200, {
    state,
    totalHospitals: hospitals.length,
    byDistrict: groupedByDistrict,
  }, 'Hospitals by state retrieved');
});

/**
 * @desc    Get emergency veterinary services
 * @route   GET /api/v1/veterinary/emergency
 * @access  Public
 */
const getEmergencyServices = asyncHandler(async (req, res) => {
  const { state, district, latitude, longitude } = req.query;

  const query = {
    isActive: true,
    'timings.emergencyAvailable': true,
  };

  if (state) query['address.state'] = new RegExp(state, 'i');
  if (district) query['address.district'] = new RegExp(district, 'i');

  let hospitals;

  if (latitude && longitude) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: 100000, // 100 km
      },
    };
  }

  hospitals = await VeterinaryHospital.find(query).limit(10);

  sendSuccess(res, 200, {
    emergencyServices: hospitals,
    helpline: '1962', // National Animal Helpline
  }, 'Emergency services retrieved');
});

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  getAllHospitals,
  getNearbyHospitals,
  getHospitalById,
  addHospital,
  updateHospital,
  deleteHospital,
  getHospitalsByState,
  getEmergencyServices,
};
