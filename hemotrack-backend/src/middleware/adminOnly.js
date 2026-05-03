const { ForbiddenError } = require('../errors/AppError');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    throw new ForbiddenError('Access denied, admin only');
  }
};

module.exports = adminOnly;
