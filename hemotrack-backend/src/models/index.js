const sequelize = require('../config/database');
const BloodBank = require('./BloodBank');
const Donor = require('./Donor');
const UserAdmin = require('./UserAdmin');
const Hospital = require('./Hospital');
const BloodUnit = require('./BloodUnit');
const DonationRecord = require('./DonationRecord');
const BloodRequest = require('./BloodRequest');
const IssueRecord = require('./IssueRecord');
const AuditLog = require('./AuditLog');

// BLOOD_BANK hasMany BLOOD_UNIT
BloodBank.hasMany(BloodUnit, { foreignKey: 'bank_id' });
BloodUnit.belongsTo(BloodBank, { foreignKey: 'bank_id' });

// DONOR hasMany DONATION_RECORD
Donor.hasMany(DonationRecord, { foreignKey: 'donor_id' });
DonationRecord.belongsTo(Donor, { foreignKey: 'donor_id' });

// BLOOD_UNIT hasOne DONATION_RECORD
BloodUnit.hasOne(DonationRecord, { foreignKey: 'unit_id' });
DonationRecord.belongsTo(BloodUnit, { foreignKey: 'unit_id' });

// BLOOD_UNIT hasOne ISSUE_RECORD
BloodUnit.hasOne(IssueRecord, { foreignKey: 'unit_id' });
IssueRecord.belongsTo(BloodUnit, { foreignKey: 'unit_id' });

// HOSPITAL hasMany BLOOD_REQUEST
Hospital.hasMany(BloodRequest, { foreignKey: 'hospital_id' });
BloodRequest.belongsTo(Hospital, { foreignKey: 'hospital_id' });

// HOSPITAL hasMany ISSUE_RECORD
Hospital.hasMany(IssueRecord, { foreignKey: 'hospital_id' });
IssueRecord.belongsTo(Hospital, { foreignKey: 'hospital_id' });

// USER_ADMIN hasMany ISSUE_RECORD (as handler)
UserAdmin.hasMany(IssueRecord, { foreignKey: 'handled_by' });
IssueRecord.belongsTo(UserAdmin, { foreignKey: 'handled_by' });

// USER_ADMIN hasMany AUDIT_LOG
UserAdmin.hasMany(AuditLog, { foreignKey: 'admin_id' });
AuditLog.belongsTo(UserAdmin, { foreignKey: 'admin_id' });

module.exports = {
  sequelize,
  BloodBank,
  Donor,
  UserAdmin,
  Hospital,
  BloodUnit,
  DonationRecord,
  BloodRequest,
  IssueRecord,
  AuditLog
};
