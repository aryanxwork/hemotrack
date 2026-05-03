const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserAdmin } = require('../models');
const { UnauthorizedError, ConflictError } = require('../errors/AppError');
const jwtConfig = require('../config/jwt');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await UserAdmin.scope('withPassword').findOne({ where: { username } });

  if (!admin) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const payload = {
    admin_id: admin.admin_id,
    username: admin.username,
    role: admin.role
  };

  const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

  res.json({
    success: true,
    token,
    user: payload
  });
});

const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

const register = asyncHandler(async (req, res) => {
  const { username, password, role = 'Patient' } = req.body;

  const existingUser = await UserAdmin.findOne({ where: { username } });
  if (existingUser) {
    throw new ConflictError('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserAdmin.create({
    username,
    password: hashedPassword,
    role
  });

  const payload = {
    admin_id: newUser.admin_id,
    username: newUser.username,
    role: newUser.role
  };

  const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

  res.status(201).json({
    success: true,
    token,
    user: payload
  });
});

module.exports = {
  login,
  logout,
  register
};
