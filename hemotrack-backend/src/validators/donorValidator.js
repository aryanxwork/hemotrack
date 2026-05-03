const Joi = require('joi');

const registerDonorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  age: Joi.number().integer().min(18).max(65).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  blood_group: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
  phone: Joi.string().pattern(/^\d{10}$/).required(),
  email: Joi.string().email().optional(),
  address: Joi.string().max(200).optional(),
  last_donation_date: Joi.date().optional()
});

const updateDonorSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  age: Joi.number().integer().min(18).max(65).optional(),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional(),
  blood_group: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').optional(),
  phone: Joi.string().pattern(/^\d{10}$/).optional(),
  email: Joi.string().email().optional(),
  address: Joi.string().max(200).optional(),
  last_donation_date: Joi.date().optional()
});

module.exports = {
  registerDonorSchema,
  updateDonorSchema
};
