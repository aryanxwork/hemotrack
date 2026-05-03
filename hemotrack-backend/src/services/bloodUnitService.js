const { BloodUnit } = require('../models');

// Expiry logic is handled in the model hooks (beforeCreate, beforeUpdate)

const createBloodUnit = async (unitData) => {
  const unit = await BloodUnit.create(unitData);
  return unit;
};

const checkStock = async (blood_group) => {
  const count = await BloodUnit.count({
    where: {
      blood_group: blood_group,
      status: 'Available'
    }
  });
  return count;
};

module.exports = {
  createBloodUnit,
  checkStock
};
