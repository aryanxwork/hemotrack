const { BloodRequest } = require('../models');
const { ConflictError, NotFoundError } = require('../errors/AppError');

const approveRequest = async (request_id) => {
  const request = await BloodRequest.findByPk(request_id);

  if (!request) {
    throw new NotFoundError('Blood request not found');
  }

  if (request.status !== 'Pending') {
    throw new ConflictError('Request is not pending');
  }

  request.status = 'Approved';
  await request.save();

  return request;
};

module.exports = {
  approveRequest
};
