/**
 * API Routes Index
 * Central router that combines all route modules
 */

const express = require('express');
const router = express.Router();

// Import route modules
const breedRoutes = require('./breed.routes');
const flwRoutes = require('./flw.routes');
const veterinaryRoutes = require('./veterinary.routes');
const dashboardRoutes = require('./dashboard.routes');
const analyticsRoutes = require('./analytics.routes');
const locationRoutes = require('./location.routes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bharat Pashudhan API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount routes
router.use('/breed', breedRoutes);
router.use('/flw', flwRoutes);
router.use('/veterinary', veterinaryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/location', locationRoutes);

module.exports = router;
