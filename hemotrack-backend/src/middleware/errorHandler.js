const logger = require('../utils/logger');
const { AppError } = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'Something went wrong';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    code = 'DATABASE_VALIDATION_ERROR';
    message = err.errors.map(e => e.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    code,
    message
  });
};

module.exports = errorHandler;
