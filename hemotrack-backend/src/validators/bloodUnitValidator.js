const Joi = require('joi');

const createBloodUnitSchema = Joi.object({
  blood_group: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-').required(),
  collection_date: Joi.date().required(),
  expiry_date: Joi.date().min(Joi.ref('collection_date')).required(),
  bank_id: Joi.number().integer().required()
});

module.exports = {
  createBloodUnitSchema
};
