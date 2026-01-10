/**
 * Location Service
 * Handles all location-related API calls
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Get user's current location using HTML5 Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
          default:
            message = 'An unknown error occurred while getting location.';
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
};

/**
 * Fetch nearby veterinarians and NGOs from the backend
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radiusKm - Search radius in kilometers (default: 10)
 * @returns {Promise<Object>} Response data containing veterinarians and NGOs
 */
export const getNearbyPlaces = async (latitude, longitude, radiusKm = 10) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/location/nearby`, {
      latitude,
      longitude,
      radiusKm,
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch nearby places');
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server error occurred');
    }
    throw error;
  }
};

/**
 * Fetch only nearby veterinarians
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Promise<Object>} Response data containing veterinarians
 */
export const getNearbyVeterinarians = async (latitude, longitude, radiusKm = 10) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/location/veterinarians`, {
      latitude,
      longitude,
      radiusKm,
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch veterinarians');
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server error occurred');
    }
    throw error;
  }
};

/**
 * Fetch only nearby animal NGOs/shelters
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Promise<Object>} Response data containing NGOs
 */
export const getNearbyNGOs = async (latitude, longitude, radiusKm = 15) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/location/ngos`, {
      latitude,
      longitude,
      radiusKm,
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Failed to fetch NGOs');
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Server error occurred');
    }
    throw error;
  }
};

export default {
  getUserLocation,
  getNearbyPlaces,
  getNearbyVeterinarians,
  getNearbyNGOs,
};
