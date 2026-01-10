/**
 * Location Service
 * Fetches nearby places using OpenStreetMap Overpass API
 */

const axios = require('axios');

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute a function with retry logic and exponential backoff
 * @param {Function} fn - Async function to execute
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<any>} Result of the function
 */
const withRetry = async (fn, maxRetries = MAX_RETRIES, initialDelay = INITIAL_RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if it's a retryable error (504, 429, or network timeout)
      const isRetryable = 
        error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT' ||
        (error.response && [504, 503, 429, 502].includes(error.response.status));
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await sleep(delay);
    }
  }
  
  throw lastError;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Generate Google Maps directions link
 * @param {number} lat - Destination latitude
 * @param {number} lon - Destination longitude
 * @param {string} name - Place name for label
 * @returns {string} Google Maps URL
 */
const generateGoogleMapsLink = (lat, lon, name) => {
  const encodedName = encodeURIComponent(name || 'Destination');
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${encodedName}`;
};

/**
 * Build Overpass query for finding nearby places
 * @param {number} lat - Center latitude
 * @param {number} lon - Center longitude
 * @param {number} radius - Search radius in meters
 * @param {string} type - Type of place: 'veterinary' or 'ngo'
 * @returns {string} Overpass QL query
 */
const buildOverpassQuery = (lat, lon, radius, type) => {
  if (type === 'veterinary') {
    // Query for veterinary clinics and animal hospitals
    return `[out:json][timeout:25];
(
  node["amenity"="veterinary"](around:${radius},${lat},${lon});
  way["amenity"="veterinary"](around:${radius},${lat},${lon});
  node["healthcare"="veterinary"](around:${radius},${lat},${lon});
  way["healthcare"="veterinary"](around:${radius},${lat},${lon});
);
out body center;`;
  } else if (type === 'ngo') {
    // Query for animal shelters and NGOs
    return `[out:json][timeout:25];
(
  node["amenity"="animal_shelter"](around:${radius},${lat},${lon});
  way["amenity"="animal_shelter"](around:${radius},${lat},${lon});
  node["amenity"="animal_boarding"](around:${radius},${lat},${lon});
  way["amenity"="animal_boarding"](around:${radius},${lat},${lon});
  node["animal"="shelter"](around:${radius},${lat},${lon});
  way["animal"="shelter"](around:${radius},${lat},${lon});
);
out body center;`;
  }
  
  return '';
};

/**
 * Parse Overpass API response into standardized format
 * @param {Array} elements - Overpass API response elements
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {string} type - Type of place
 * @returns {Array} Parsed places
 */
const parseOverpassResponse = (elements, userLat, userLon, type) => {
  const places = [];
  const seen = new Set();

  for (const element of elements) {
    // Get coordinates (either from node or center of way)
    const lat = element.lat || (element.center && element.center.lat);
    const lon = element.lon || (element.center && element.center.lon);

    if (!lat || !lon) continue;

    const tags = element.tags || {};
    const name = tags.name || tags['name:en'] || 
                 (type === 'veterinary' ? 'Veterinary Clinic' : 'Animal Shelter');
    
    // Create unique key to avoid duplicates
    const key = `${lat.toFixed(5)}-${lon.toFixed(5)}-${name}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Build address from available tags
    const addressParts = [];
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
    if (tags['addr:street']) addressParts.push(tags['addr:street']);
    if (tags['addr:city']) addressParts.push(tags['addr:city']);
    if (tags['addr:state']) addressParts.push(tags['addr:state']);
    if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
    
    const address = addressParts.length > 0 
      ? addressParts.join(', ') 
      : tags['addr:full'] || 'Address not available';

    // Calculate distance
    const distance = calculateDistance(userLat, userLon, lat, lon);

    places.push({
      id: element.id,
      name,
      address,
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      phone: tags.phone || tags['contact:phone'] || null,
      website: tags.website || tags['contact:website'] || null,
      email: tags.email || tags['contact:email'] || null,
      openingHours: tags.opening_hours || null,
      coordinates: { lat, lon },
      googleMapsLink: generateGoogleMapsLink(lat, lon, name),
      type: type === 'veterinary' ? 'Veterinary' : 'NGO/Shelter',
      raw: tags, // Include raw tags for additional info
    });
  }

  // Sort by distance
  return places.sort((a, b) => a.distance - b.distance);
};

/**
 * Fetch nearby veterinarians using Overpass API
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radiusKm - Search radius in kilometers (default: 10)
 * @returns {Promise<Array>} Array of nearby veterinarians
 */
const getNearbyVeterinarians = async (latitude, longitude, radiusKm = 10) => {
  try {
    const radiusMeters = radiusKm * 1000;
    const query = buildOverpassQuery(latitude, longitude, radiusMeters, 'veterinary');

    const response = await withRetry(async () => {
      return await axios.get(OVERPASS_API_URL, {
        params: { data: query },
        timeout: 30000,
      });
    });

    if (!response.data || !response.data.elements) {
      return [];
    }

    return parseOverpassResponse(
      response.data.elements,
      latitude,
      longitude,
      'veterinary'
    );
  } catch (error) {
    console.error('Error fetching veterinarians:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    // Return empty array instead of throwing to allow partial results
    return [];
  }
};

/**
 * Fetch nearby animal NGOs/shelters using Overpass API
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radiusKm - Search radius in kilometers (default: 15)
 * @returns {Promise<Array>} Array of nearby NGOs/shelters
 */
const getNearbyNGOs = async (latitude, longitude, radiusKm = 15) => {
  try {
    const radiusMeters = radiusKm * 1000;
    const query = buildOverpassQuery(latitude, longitude, radiusMeters, 'ngo');

    const response = await withRetry(async () => {
      return await axios.get(OVERPASS_API_URL, {
        params: { data: query },
        timeout: 30000,
      });
    });

    if (!response.data || !response.data.elements) {
      return [];
    }

    return parseOverpassResponse(
      response.data.elements,
      latitude,
      longitude,
      'ngo'
    );
  } catch (error) {
    console.error('Error fetching NGOs:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    // Return empty array instead of throwing to allow partial results
    return [];
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Address details
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${NOMINATIM_API_URL}/reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'BharatPashudhan/1.0',
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding:', error.message);
    return null;
  }
};

module.exports = {
  getNearbyVeterinarians,
  getNearbyNGOs,
  reverseGeocode,
  calculateDistance,
  generateGoogleMapsLink,
};
