const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BloodUnit = sequelize.define('BloodUnit', {
  unit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blood_group: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  collection_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Available', 'Issued', 'Expired'),
    defaultValue: 'Available'
  },
  bank_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'BLOOD_UNIT',
  timestamps: false,
  hooks: {
    beforeCreate: (unit) => {
      if (new Date(unit.expiry_date) < new Date()) {
        unit.status = 'Expired';
      }
    },
    beforeUpdate: (unit) => {
      if (new Date(unit.expiry_date) < new Date()) {
        unit.status = 'Expired';
      }
    }
  }
});

module.exports = BloodUnit;
