const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hospital = sequelize.define('Hospital', {
  hospital_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hospital_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(200)
  },
  contact_no: {
    type: DataTypes.STRING(15),
    unique: true
  },
  email: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'HOSPITAL',
  timestamps: false
});

module.exports = Hospital;
