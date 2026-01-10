/**
 * Validation Middleware
 * Request validation using express-validator
 */

const { validationResult, body, param, query } = require('express-validator');
const { ApiError } = require('../utils/apiResponse');

/**
 * Validate request and return errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new ApiError(400, 'Validation failed', errorMessages);
  }
  next();
};

/**
 * Auth validation rules
 */
const authValidation = {
  register: [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'government', 'flw', 'user'])
      .withMessage('Invalid role'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
};

/**
 * FLW Data validation rules
 */
const flwDataValidation = {
  create: [
    body('flwId').notEmpty().withMessage('FLW ID is required'),
    body('flwName').notEmpty().withMessage('FLW Name is required'),
    body('village').notEmpty().withMessage('Village is required'),
    body('district').notEmpty().withMessage('District is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('cattleBreed').notEmpty().withMessage('Cattle breed is required'),
    body('cattleAge.value')
      .isNumeric()
      .withMessage('Cattle age value must be a number'),
    body('cattleAge.unit')
      .isIn(['months', 'years'])
      .withMessage('Age unit must be months or years'),
    body('gender')
      .isIn(['male', 'female'])
      .withMessage('Gender must be male or female'),
    body('lactationStatus')
      .optional()
      .isIn(['lactating', 'dry', 'pregnant', 'not-applicable'])
      .withMessage('Invalid lactation status'),
  ],

  update: [
    param('id').isMongoId().withMessage('Invalid record ID'),
  ],
};

/**
 * Query validation
 */
const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  dateRange: [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date'),
  ],
};

module.exports = {
  validate,
  authValidation,
  flwDataValidation,
  queryValidation,
};
