const { DonationRecord, Donor, BloodUnit } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../errors/AppError');

const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await DonationRecord.findAll({
    include: [
      { model: Donor, attributes: ['name', 'blood_group', 'phone'] },
      { model: BloodUnit, attributes: ['blood_group', 'collection_date', 'status'] }
    ]
  });
  res.json({ success: true, data: donations });
});

const getDonationById = asyncHandler(async (req, res) => {
  const donation = await DonationRecord.findByPk(req.params.id, {
    include: [
      { model: Donor, attributes: ['name', 'blood_group', 'phone'] },
      { model: BloodUnit, attributes: ['blood_group', 'collection_date', 'status'] }
    ]
  });
  if (!donation) throw new NotFoundError('Donation record not found');
  res.json({ success: true, data: donation });
});

const createDonation = asyncHandler(async (req, res) => {
  const donation = await DonationRecord.create(req.body);
  res.status(201).json({ success: true, data: donation });
});

module.exports = {
  getAllDonations,
  getDonationById,
  createDonation
};
