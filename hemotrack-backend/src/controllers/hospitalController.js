const { Hospital, BloodRequest } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../errors/AppError');

const getAllHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.findAll();
  res.json({ success: true, data: hospitals });
});

const getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByPk(req.params.id);
  if (!hospital) throw new NotFoundError('Hospital not found');
  res.json({ success: true, data: hospital });
});

const getHospitalRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.findAll({ where: { hospital_id: req.params.id } });
  res.json({ success: true, data: requests });
});

const createHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json({ success: true, data: hospital });
});

const updateHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByPk(req.params.id);
  if (!hospital) throw new NotFoundError('Hospital not found');
  
  await hospital.update(req.body);
  res.json({ success: true, data: hospital });
});

const deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByPk(req.params.id);
  if (!hospital) throw new NotFoundError('Hospital not found');
  
  await hospital.destroy();
  res.json({ success: true, message: 'Hospital deleted successfully' });
});

module.exports = {
  getAllHospitals,
  getHospitalById,
  getHospitalRequests,
  createHospital,
  updateHospital,
  deleteHospital
};
