const { Donor } = require('../models');
const donorService = require('../services/donorService');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../errors/AppError');

const getAllDonors = asyncHandler(async (req, res) => {
  const { blood_group } = req.query;
  const whereClause = {};
  if (blood_group) {
    whereClause.blood_group = blood_group;
  }
  const donors = await Donor.findAll({ where: whereClause });
  res.json({ success: true, data: donors });
});

const getDonorById = asyncHandler(async (req, res) => {
  const donor = await Donor.findByPk(req.params.id);
  if (!donor) throw new NotFoundError('Donor not found');
  res.json({ success: true, data: donor });
});

const registerDonor = asyncHandler(async (req, res) => {
  const newDonor = await donorService.registerDonor(req.body);
  res.status(201).json({ success: true, message: 'Donor registered successfully', data: newDonor });
});

const updateDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findByPk(req.params.id);
  if (!donor) throw new NotFoundError('Donor not found');
  
  await donor.update(req.body);
  res.json({ success: true, message: 'Donor updated successfully', data: donor });
});

const deleteDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findByPk(req.params.id);
  if (!donor) throw new NotFoundError('Donor not found');
  
  await donor.destroy();
  res.json({ success: true, message: 'Donor deleted successfully' });
});

module.exports = {
  getAllDonors,
  getDonorById,
  registerDonor,
  updateDonor,
  deleteDonor
};
