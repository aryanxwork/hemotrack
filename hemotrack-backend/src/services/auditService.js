const { AuditLog } = require('../models');
const logger = require('../utils/logger');

const logAction = async (admin_id, action, table_name, record_id, transaction = null) => {
  try {
    await AuditLog.create({
      admin_id,
      action,
      table_name,
      record_id
    }, { transaction });
    logger.info(`AuditLog: Admin ${admin_id} performed ${action} on ${table_name} (ID: ${record_id})`);
  } catch (error) {
    logger.error('Failed to log audit action:', error);
    // don't throw to prevent interrupting the main business logic
  }
};

module.exports = {
  logAction
};
