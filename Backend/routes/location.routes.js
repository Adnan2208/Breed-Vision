/**
 * Location Routes
 * Routes for fetching nearby veterinarians and animal NGOs
 */

const express = require('express');
const router = express.Router();

const {
  getNearbyPlaces,
  getNearbyVets,
  getNearbyAnimalNGOs,
} = require('../controllers/location.controller');

/**
 * @route   POST /api/v1/location/nearby
 * @desc    Get both nearby veterinarians and animal NGOs
 * @access  Public
 * @body    { latitude: number, longitude: number, radiusKm?: number }
 * 
 * @example Request:
 * POST /api/v1/location/nearby
 * {
 *   "latitude": 28.6139,
 *   "longitude": 77.2090,
 *   "radiusKm": 10
 * }
 * 
 * @example Response:
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "data": {
 *     "veterinarians": [
 *       {
 *         "id": 123456789,
 *         "name": "City Pet Clinic",
 *         "address": "123 Main St, New Delhi, Delhi 110001",
 *         "distance": 1.25,
 *         "phone": "+91-11-12345678",
 *         "website": "https://example.com",
 *         "openingHours": "Mo-Sa 09:00-20:00",
 *         "coordinates": { "lat": 28.6150, "lon": 77.2100 },
 *         "googleMapsLink": "https://www.google.com/maps/dir/...",
 *         "type": "Veterinary"
 *       }
 *     ],
 *     "ngos": [
 *       {
 *         "id": 987654321,
 *         "name": "Animal Welfare Society",
 *         "address": "456 Park Road, New Delhi",
 *         "distance": 3.75,
 *         "phone": "+91-11-87654321",
 *         "coordinates": { "lat": 28.6200, "lon": 77.2150 },
 *         "googleMapsLink": "https://www.google.com/maps/dir/...",
 *         "type": "NGO/Shelter"
 *       }
 *     ],
 *     "userLocation": {
 *       "coordinates": { "latitude": 28.6139, "longitude": 77.2090 },
 *       "address": "Connaught Place, New Delhi, Delhi, India",
 *       "city": "New Delhi",
 *       "state": "Delhi",
 *       "country": "India"
 *     },
 *     "searchRadius": "10 km",
 *     "counts": {
 *       "veterinarians": 1,
 *       "ngos": 1
 *     }
 *   },
 *   "message": "Nearby places retrieved successfully"
 * }
 */
router.post('/nearby', getNearbyPlaces);

/**
 * @route   POST /api/v1/location/veterinarians
 * @desc    Get nearby veterinarians only
 * @access  Public
 * @body    { latitude: number, longitude: number, radiusKm?: number }
 */
router.post('/veterinarians', getNearbyVets);

/**
 * @route   POST /api/v1/location/ngos
 * @desc    Get nearby animal NGOs and shelters only
 * @access  Public
 * @body    { latitude: number, longitude: number, radiusKm?: number }
 */
router.post('/ngos', getNearbyAnimalNGOs);

module.exports = router;
