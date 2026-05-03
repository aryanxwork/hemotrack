const { IssueRecord } = require('../models');
const issueService = require('../services/issueService');
const asyncHandler = require('../utils/asyncHandler');

const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await IssueRecord.findAll({ order: [['issue_date', 'DESC']] });
  res.json({ success: true, data: issues });
});

const issueBlood = asyncHandler(async (req, res) => {
  const { unit_id, hospital_id } = req.body;
  const admin_id = req.user.admin_id;

  const issueRecord = await issueService.issueBlood(unit_id, hospital_id, admin_id);
  
  res.status(201).json({
    success: true,
    message: 'Blood unit issued successfully',
    data: issueRecord
  });
});

module.exports = {
  getAllIssues,
  issueBlood
};
