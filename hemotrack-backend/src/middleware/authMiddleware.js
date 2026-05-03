const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/AppError');
const jwtConfig = require('../config/jwt');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided, authorization denied');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Token is invalid or expired');
  }
};

module.exports = authMiddleware;
