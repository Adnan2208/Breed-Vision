/**
 * Roboflow YOLO API Service
 * Handles breed detection using Roboflow's hosted YOLO model
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class RoboflowService {
  constructor() {
    this.apiKey = process.env.ROBOFLOW_API_KEY;
    this.modelEndpoint = process.env.ROBOFLOW_MODEL_ENDPOINT;
    this.modelVersion = process.env.ROBOFLOW_MODEL_VERSION || '1';
  }

  /**
   * Detect cattle breed from image file
   * @param {string} imagePath - Path to the image file
   * @returns {Object} Detection result with breed and confidence
   */
  async detectBreed(imagePath) {
    try {
      if (!this.apiKey || !this.modelEndpoint) {
        throw new Error('Roboflow API configuration missing');
      }

      // Read image and convert to base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Construct API URL
      const apiUrl = `https://detect.roboflow.com/${this.modelEndpoint}/${this.modelVersion}`;

      // Make request to Roboflow API
      const response = await axios({
        method: 'POST',
        url: apiUrl,
        params: {
          api_key: this.apiKey,
        },
        data: base64Image,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000, // 30 second timeout
      });

      // Parse response
      const predictions = response.data.predictions || [];
      
      if (predictions.length === 0) {
        return {
          success: true,
          detected: false,
          breed: null,
          confidence: null,
          message: 'No cattle breed detected in the image',
          rawResponse: response.data,
        };
      }

      // Get the prediction with highest confidence
      const topPrediction = predictions.reduce((prev, current) =>
        prev.confidence > current.confidence ? prev : current
      );

      return {
        success: true,
        detected: true,
        breed: this.normalizeBreedName(topPrediction.class),
        confidence: Math.round(topPrediction.confidence * 100) / 100,
        boundingBox: {
          x: topPrediction.x,
          y: topPrediction.y,
          width: topPrediction.width,
          height: topPrediction.height,
        },
        allPredictions: predictions.map((p) => ({
          breed: this.normalizeBreedName(p.class),
          confidence: Math.round(p.confidence * 100) / 100,
        })),
        rawResponse: response.data,
      };
    } catch (error) {
      console.error('Roboflow API Error:', error.message);

      // Handle specific error types
      if (error.code === 'ECONNABORTED') {
        throw new Error('Breed detection timeout. Please try again.');
      }

      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Invalid Roboflow API key');
        }
        if (status === 404) {
          throw new Error('Roboflow model not found');
        }
        if (status === 429) {
          throw new Error('Roboflow API rate limit exceeded');
        }
      }

      throw new Error(`Breed detection failed: ${error.message}`);
    }
  }

  /**
   * Detect breed from image URL
   * @param {string} imageUrl - URL of the image
   * @returns {Object} Detection result
   */
  async detectBreedFromUrl(imageUrl) {
    try {
      if (!this.apiKey || !this.modelEndpoint) {
        throw new Error('Roboflow API configuration missing');
      }

      const apiUrl = `https://detect.roboflow.com/${this.modelEndpoint}/${this.modelVersion}`;

      const response = await axios({
        method: 'POST',
        url: apiUrl,
        params: {
          api_key: this.apiKey,
          image: imageUrl,
        },
        timeout: 30000,
      });

      const predictions = response.data.predictions || [];

      if (predictions.length === 0) {
        return {
          success: true,
          detected: false,
          breed: null,
          confidence: null,
          message: 'No cattle breed detected in the image',
        };
      }

      const topPrediction = predictions.reduce((prev, current) =>
        prev.confidence > current.confidence ? prev : current
      );

      return {
        success: true,
        detected: true,
        breed: this.normalizeBreedName(topPrediction.class),
        confidence: Math.round(topPrediction.confidence * 100) / 100,
        allPredictions: predictions.map((p) => ({
          breed: this.normalizeBreedName(p.class),
          confidence: Math.round(p.confidence * 100) / 100,
        })),
      };
    } catch (error) {
      console.error('Roboflow URL Detection Error:', error.message);
      throw new Error(`Breed detection failed: ${error.message}`);
    }
  }

  /**
   * Normalize breed name for consistency
   * @param {string} breedName - Raw breed name from model
   * @returns {string} Normalized breed name
   */
  normalizeBreedName(breedName) {
    if (!breedName) return 'unknown';

    // Mapping of model class names to standardized breed names
    const breedMapping = {
      'gir': 'Gir',
      'gir_cattle': 'Gir',
      'sahiwal': 'Sahiwal',
      'sahiwal_cattle': 'Sahiwal',
      'red_sindhi': 'Red Sindhi',
      'redsindhi': 'Red Sindhi',
      'tharparkar': 'Tharparkar',
      'kankrej': 'Kankrej',
      'ongole': 'Ongole',
      'hariana': 'Hariana',
      'hf': 'Holstein Friesian',
      'holstein': 'Holstein Friesian',
      'holstein_friesian': 'Holstein Friesian',
      'jersey': 'Jersey',
      'crossbreed': 'Crossbreed',
      'cross_breed': 'Crossbreed',
      'murrah': 'Murrah',
      'murrah_buffalo': 'Murrah',
      'buffalo': 'Murrah',
    };

    const normalized = breedName.toLowerCase().replace(/[\s-]/g, '_');
    return breedMapping[normalized] || breedName;
  }

  /**
   * Validate API configuration
   * @returns {boolean} True if configured properly
   */
  isConfigured() {
    return !!(this.apiKey && this.modelEndpoint);
  }
}

module.exports = new RoboflowService();
