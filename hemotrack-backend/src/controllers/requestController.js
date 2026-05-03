const { BloodRequest } = require('../models');
const requestService = require('../services/requestService');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError, UnauthorizedError } = require('../errors/AppError');

const getAllRequests = asyncHandler(async (req, res) => {
  const { status, blood_group } = req.query;
  const whereClause = {};
  
  // If patient, only show their own requests
  if (req.user && req.user.role === 'Patient') {
    whereClause.user_id = req.user.admin_id;
  }
  
  if (status) whereClause.status = status;
  if (blood_group) whereClause.blood_group = blood_group;
  
  const requests = await BloodRequest.findAll({ where: whereClause });
  res.json({ success: true, data: requests });
});

const getRequestById = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findByPk(req.params.id);
  if (!request) throw new NotFoundError('Request not found');
  
  // If patient, ensure it's their own request
  if (req.user && req.user.role === 'Patient' && request.user_id !== req.user.admin_id) {
    throw new UnauthorizedError('Unauthorized access to this request');
  }
  
  res.json({ success: true, data: request });
});

const createRequest = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.user) {
    data.user_id = req.user.admin_id;
  }
  const request = await BloodRequest.create(data);
  res.status(201).json({ success: true, data: request });
});

const approveRequest = asyncHandler(async (req, res) => {
  const request = await requestService.approveRequest(req.params.id);
  res.json({ success: true, message: 'Request approved successfully', data: request });
});

const rejectRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findByPk(req.params.id);
  if (!request) throw new NotFoundError('Request not found');
  
  request.status = 'Rejected';
  await request.save();
  
  res.json({ success: true, message: 'Request rejected successfully', data: request });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findByPk(req.params.id);
  if (!request) throw new NotFoundError('Request not found');
  
  await request.destroy();
  res.json({ success: true, message: 'Request deleted successfully' });
});

module.exports = {
  getAllRequests,
  getRequestById,
  createRequest,
  approveRequest,
  rejectRequest,
  deleteRequest
};
