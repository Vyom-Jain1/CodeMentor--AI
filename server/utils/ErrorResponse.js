class ErrorResponse extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || this.generateErrorCode(statusCode);
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  generateErrorCode(statusCode) {
    const codeMap = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE'
    };

    return codeMap[statusCode] || 'UNKNOWN_ERROR';
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        ...(process.env.NODE_ENV === 'development' && {
          stack: this.stack,
          details: this.details
        })
      }
    };
  }

  static badRequest(message = 'Bad Request', details = null) {
    return new ErrorResponse(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized', details = null) {
    return new ErrorResponse(message, 401, 'UNAUTHORIZED', details);
  }

  static forbidden(message = 'Forbidden', details = null) {
    return new ErrorResponse(message, 403, 'FORBIDDEN', details);
  }

  static notFound(message = 'Not Found', details = null) {
    return new ErrorResponse(message, 404, 'NOT_FOUND', details);
  }

  static conflict(message = 'Conflict', details = null) {
    return new ErrorResponse(message, 409, 'CONFLICT', details);
  }

  static validationError(message = 'Validation Error', details = null) {
    return new ErrorResponse(message, 422, 'VALIDATION_ERROR', details);
  }

  static tooManyRequests(message = 'Too Many Requests', details = null) {
    return new ErrorResponse(message, 429, 'TOO_MANY_REQUESTS', details);
  }

  static internal(message = 'Internal Server Error', details = null) {
    return new ErrorResponse(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }

  static serviceUnavailable(message = 'Service Unavailable', details = null) {
    return new ErrorResponse(message, 503, 'SERVICE_UNAVAILABLE', details);
  }
}

module.exports = ErrorResponse;
