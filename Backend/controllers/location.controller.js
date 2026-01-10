/**
 * Location Controller
 * Handles location-based queries for nearby veterinarians and NGOs
 */

const asyncHandler = require('../utils/asyncHandler');
const { ApiError, sendSuccess } = require('../utils/apiResponse');
const {
  getNearbyVeterinarians,
  getNearbyNGOs,
  reverseGeocode,
} = require('../services/location.service');

/**
 * @desc    Get nearby veterinarians and NGOs
 * @route   POST /api/v1/location/nearby
 * @access  Public
 * @body    { latitude: number, longitude: number, radiusKm?: number }
 */
const getNearbyPlaces = asyncHandler(async (req, res) => {
  const { latitude, longitude, radiusKm = 10 } = req.body;

  // Validate coordinates
  if (latitude === undefined || longitude === undefined) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new ApiError(400, 'Invalid latitude or longitude values');
  }

  if (lat < -90 || lat > 90) {
    throw new ApiError(400, 'Latitude must be between -90 and 90');
  }

  if (lon < -180 || lon > 180) {
    throw new ApiError(400, 'Longitude must be between -180 and 180');
  }

  const radius = parseFloat(radiusKm) || 10;

  // Fetch nearby places in parallel
  const [veterinarians, ngos, locationInfo] = await Promise.all([
    getNearbyVeterinarians(lat, lon, radius),
    getNearbyNGOs(lat, lon, radius * 1.5), // Larger radius for NGOs as they're less common
    reverseGeocode(lat, lon),
  ]);

  // Build location context
  const userLocation = {
    coordinates: { latitude: lat, longitude: lon },
    address: locationInfo?.display_name || null,
    city: locationInfo?.address?.city || 
          locationInfo?.address?.town || 
          locationInfo?.address?.village || null,
    state: locationInfo?.address?.state || null,
    country: locationInfo?.address?.country || null,
  };

  sendSuccess(res, 200, {
    veterinarians,
    ngos,
    userLocation,
    searchRadius: `${radius} km`,
    counts: {
      veterinarians: veterinarians.length,
      ngos: ngos.length,
    },
  }, 'Nearby places retrieved successfully');
});

/**
 * @desc    Get nearby veterinarians only
 * @route   POST /api/v1/location/veterinarians
 * @access  Public
 * @body    { latitude: number, longitude: number, radiusKm?: number }
 */
const getNearbyVets = asyncHandler(async (req, res) => {
  const { latitude, longitude, radiusKm = 10 } = req.body;

  if (latitude === undefined || longitude === undefined) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new ApiError(400, 'Invalid latitude or longitude values');
  }

  const radius = parseFloat(radiusKm) || 10;
  const veterinarians = await getNearbyVeterinarians(lat, lon, radius);

  sendSuccess(res, 200, {
    veterinarians,
    searchRadius: `${radius} km`,
    count: veterinarians.length,
  }, 'Nearby veterinarians retrieved successfully');
});

/**
 * @desc    Get nearby animal NGOs/shelters only
 * @route   POST /api/v1/location/ngos
 * @access  Public
 * @body    { latitude: number, longitude: number, radiusKm?: number }
 */
const getNearbyAnimalNGOs = asyncHandler(async (req, res) => {
  const { latitude, longitude, radiusKm = 15 } = req.body;

  if (latitude === undefined || longitude === undefined) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lon)) {
    throw new ApiError(400, 'Invalid latitude or longitude values');
  }

  const radius = parseFloat(radiusKm) || 15;
  const ngos = await getNearbyNGOs(lat, lon, radius);

  sendSuccess(res, 200, {
    ngos,
    searchRadius: `${radius} km`,
    count: ngos.length,
  }, 'Nearby animal NGOs retrieved successfully');
});

module.exports = {
  getNearbyPlaces,
  getNearbyVets,
  getNearbyAnimalNGOs,
};
