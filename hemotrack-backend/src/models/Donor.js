const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donor = sequelize.define('Donor', {
  donor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    validate: {
      min: 18,
      max: 65
    }
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other')
  },
  blood_group: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    unique: true
  },
  email: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.STRING(200)
  },
  last_donation_date: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'DONOR',
  timestamps: false
});

module.exports = Donor;
