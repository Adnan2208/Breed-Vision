/**
 * Standardized API Response Utility
 * Provides consistent response format across all endpoints
 */

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Send success response
 */
const sendSuccess = (res, statusCode, data, message) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

/**
 * Send error response
 */
const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    data: null,
  });
};

module.exports = {
  ApiResponse,
  ApiError,
  sendSuccess,
  sendError,
};
