const { BloodBank } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../errors/AppError');

const getAllBloodBanks = asyncHandler(async (req, res) => {
  const banks = await BloodBank.findAll();
  res.json({ success: true, data: banks });
});

const getBloodBankById = asyncHandler(async (req, res) => {
  const bank = await BloodBank.findByPk(req.params.id);
  if (!bank) throw new NotFoundError('Blood bank not found');
  res.json({ success: true, data: bank });
});

const createBloodBank = asyncHandler(async (req, res) => {
  const bank = await BloodBank.create(req.body);
  res.status(201).json({ success: true, data: bank });
});

const updateBloodBank = asyncHandler(async (req, res) => {
  const bank = await BloodBank.findByPk(req.params.id);
  if (!bank) throw new NotFoundError('Blood bank not found');
  
  await bank.update(req.body);
  res.json({ success: true, data: bank });
});

const deleteBloodBank = asyncHandler(async (req, res) => {
  const bank = await BloodBank.findByPk(req.params.id);
  if (!bank) throw new NotFoundError('Blood bank not found');
  
  await bank.destroy();
  res.json({ success: true, message: 'Blood bank deleted successfully' });
});

module.exports = {
  getAllBloodBanks,
  getBloodBankById,
  createBloodBank,
  updateBloodBank,
  deleteBloodBank
};
