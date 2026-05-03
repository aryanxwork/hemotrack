const { Donor } = require('../models');
const { ValidationError, ConflictError } = require('../errors/AppError');

const registerDonor = async (donorData) => {
  if (donorData.age < 18 || donorData.age > 65) {
    throw new ValidationError('Age must be between 18 and 65');
  }

  try {
    const donor = await Donor.create(donorData);
    return donor;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('Phone number or email already exists');
    }
    throw error;
  }
};

module.exports = {
  registerDonor
};
