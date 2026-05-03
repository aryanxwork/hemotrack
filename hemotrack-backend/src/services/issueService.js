const { BloodUnit, IssueRecord, sequelize } = require('../models');
const { ConflictError, NotFoundError } = require('../errors/AppError');
const auditService = require('./auditService');

const issueBlood = async (unit_id, hospital_id, admin_id) => {
  const t = await sequelize.transaction();

  try {
    const unit = await BloodUnit.findByPk(unit_id, { transaction: t });

    if (!unit) {
      throw new NotFoundError('Blood unit not found');
    }

    if (unit.status !== 'Available') {
      throw new ConflictError('Blood unit is not available');
    }

    // Attempt to insert into ISSUE_RECORD
    const issueRecord = await IssueRecord.create({
      unit_id,
      hospital_id,
      handled_by: admin_id
    }, { transaction: t });

    // Update BLOOD_UNIT status
    unit.status = 'Issued';
    await unit.save({ transaction: t });

    // Commit transaction
    await t.commit();

    // Fire audit log after successful commit
    await auditService.logAction(admin_id, 'ISSUE_BLOOD', 'ISSUE_RECORD', issueRecord.issue_id);

    return issueRecord;

  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('Blood unit has already been issued');
    }
    throw error;
  }
};

module.exports = {
  issueBlood
};
