/**
 * Bharat Pashudhan - Government Livestock Intelligence Platform
 * Main Server Entry Point
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import configurations
const connectDB = require('./config/database');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');

// Import routes
const routes = require('./routes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ===================
// Security Middleware
// ===================

// Set security HTTP headers
app.use(helmet());

// Prevent NoSQL injection
app.use(mongoSanitize());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ===================
// General Middleware
// ===================

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use('/api', apiLimiter);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===================
// API Routes
// ===================

// Mount all routes under /api/v1
app.use('/api/v1', routes);

// Also mount routes under /api (without version) for flexibility
app.use('/api', routes);

// Mount routes at root level for requests like /breed/detect
app.use('/', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Bharat Pashudhan API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    note: 'All endpoints are publicly accessible - no authentication required',
    endpoints: {
      breed: '/api/v1/breed',
      flw: '/api/v1/flw',
      veterinary: '/api/v1/veterinary',
      dashboard: '/api/v1/dashboard',
    },
  });
});

// ===================
// Error Handling
// ===================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ===================
// Server Initialization
// ===================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
  });
});

module.exports = app;
