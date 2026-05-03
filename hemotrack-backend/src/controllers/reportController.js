const { Donor, BloodUnit, DonationRecord, BloodBank, sequelize } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const donorReport = asyncHandler(async (req, res) => {
  const donors = await Donor.findAll({
    attributes: ['name', 'blood_group', 'phone']
  });
  res.json({ success: true, data: donors });
});

const stockReport = asyncHandler(async (req, res) => {
  const stock = await BloodUnit.findAll({
    attributes: [
      'blood_group',
      [sequelize.fn('COUNT', sequelize.col('unit_id')), 'count']
    ],
    where: { status: 'Available' },
    group: ['blood_group']
  });
  res.json({ success: true, data: stock });
});

const donationReport = asyncHandler(async (req, res) => {
  const donations = await DonationRecord.findAll({
    include: [
      { model: Donor, attributes: ['name', 'blood_group'] },
      { model: BloodUnit, attributes: ['collection_date', 'status'] }
    ]
  });
  res.json({ success: true, data: donations });
});

const expiredReport = asyncHandler(async (req, res) => {
  const expiredUnits = await BloodUnit.findAll({
    where: { status: 'Expired' },
    include: [
      { model: BloodBank, attributes: ['bank_name'] }
    ]
  });
  res.json({ success: true, data: expiredUnits });
});

module.exports = {
  donorReport,
  stockReport,
  donationReport,
  expiredReport
};
