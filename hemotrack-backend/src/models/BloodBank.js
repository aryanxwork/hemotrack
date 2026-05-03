const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BloodBank = sequelize.define('BloodBank', {
  bank_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bank_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(150)
  },
  contact_no: {
    type: DataTypes.STRING(15),
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true
  }
}, {
  tableName: 'BLOOD_BANK',
  timestamps: false
});

module.exports = BloodBank;
