const Joi = require('joi');

const issueBloodSchema = Joi.object({
  unit_id: Joi.number().integer().required(),
  hospital_id: Joi.number().integer().required()
});

module.exports = {
  issueBloodSchema
};
