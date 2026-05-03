const { AuditLog } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../errors/AppError');

const getAllLogs = asyncHandler(async (req, res) => {
  const { admin_id } = req.query;
  const whereClause = {};
  if (admin_id) whereClause.admin_id = admin_id;

  const logs = await AuditLog.findAll({ where: whereClause, order: [['log_time', 'DESC']] });
  res.json({ success: true, data: logs });
});

const getLogById = asyncHandler(async (req, res) => {
  const log = await AuditLog.findByPk(req.params.id);
  if (!log) throw new NotFoundError('Audit log not found');
  res.json({ success: true, data: log });
});

module.exports = {
  getAllLogs,
  getLogById
};
