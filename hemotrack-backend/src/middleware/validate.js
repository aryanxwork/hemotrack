const { ValidationError } = require('../errors/AppError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      throw new ValidationError(errorMessage);
    }
    next();
  };
};

module.exports = validate;
