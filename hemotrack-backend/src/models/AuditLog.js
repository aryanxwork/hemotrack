const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_id: {
    type: DataTypes.INTEGER
  },
  action: {
    type: DataTypes.STRING(100)
  },
  table_name: {
    type: DataTypes.STRING(50)
  },
  record_id: {
    type: DataTypes.INTEGER
  },
  log_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'AUDIT_LOG',
  timestamps: false
});

module.exports = AuditLog;
