const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IssueRecord = sequelize.define('IssueRecord', {
  issue_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  unit_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  issue_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  handled_by: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'ISSUE_RECORD',
  timestamps: false
});

module.exports = IssueRecord;
