const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BloodRequest = sequelize.define('BloodRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  blood_group: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1
    }
  },
  request_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Allow null for legacy requests or non-patient requests
  }
}, {
  tableName: 'BLOOD_REQUEST',
  timestamps: false
});

module.exports = BloodRequest;
