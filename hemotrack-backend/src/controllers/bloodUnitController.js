const { BloodUnit } = require('../models');
const bloodUnitService = require('../services/bloodUnitService');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../errors/AppError');

const getAllBloodUnits = asyncHandler(async (req, res) => {
  const { status, blood_group } = req.query;
  const whereClause = {};
  if (status) whereClause.status = status;
  if (blood_group) whereClause.blood_group = blood_group;
  
  const units = await BloodUnit.findAll({ where: whereClause });
  res.json({ success: true, data: units });
});

const getBloodUnitById = asyncHandler(async (req, res) => {
  const unit = await BloodUnit.findByPk(req.params.id);
  if (!unit) throw new NotFoundError('Blood unit not found');
  res.json({ success: true, data: unit });
});

const createBloodUnit = asyncHandler(async (req, res) => {
  const unit = await bloodUnitService.createBloodUnit(req.body);
  res.status(201).json({ success: true, data: unit });
});

const updateBloodUnit = asyncHandler(async (req, res) => {
  const unit = await BloodUnit.findByPk(req.params.id);
  if (!unit) throw new NotFoundError('Blood unit not found');
  
  await unit.update(req.body);
  res.json({ success: true, data: unit });
});

const deleteBloodUnit = asyncHandler(async (req, res) => {
  const unit = await BloodUnit.findByPk(req.params.id);
  if (!unit) throw new NotFoundError('Blood unit not found');
  
  await unit.destroy();
  res.json({ success: true, message: 'Blood unit deleted successfully' });
});

const getStock = asyncHandler(async (req, res) => {
  const { blood_group } = req.params;
  const count = await bloodUnitService.checkStock(blood_group);
  res.json({ success: true, data: { blood_group, stock: count } });
});

module.exports = {
  getAllBloodUnits,
  getBloodUnitById,
  createBloodUnit,
  updateBloodUnit,
  deleteBloodUnit,
  getStock
};
