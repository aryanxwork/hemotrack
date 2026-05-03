class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized', 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(message || 'Forbidden', 403, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Resource not found', 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
};
