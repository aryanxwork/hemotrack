const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonationRecord = sequelize.define('DonationRecord', {
  record_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  donation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  remarks: {
    type: DataTypes.STRING(200)
  }
}, {
  tableName: 'DONATION_RECORD',
  timestamps: false
});

module.exports = DonationRecord;
