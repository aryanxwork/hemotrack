const Joi = require('joi');

const createRequestSchema = Joi.object({
  hospital_id: Joi.number().integer().required(),
  blood_group: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
  quantity: Joi.number().integer().min(1).required()
});

module.exports = {
  createRequestSchema
};
