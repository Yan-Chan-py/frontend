const HttpError = require('../helpers/HttpError');

/**
 * Joi body validation middleware helper.
 * Throws 400 error if body is empty or validation fails.
 */
function validateBody(schema) {
  return (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new HttpError(400, 'missing fields'));
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map(d => d.message).join(', ');
      return next(new HttpError(400, details));
    }

    next();
  };
}

module.exports = validateBody;
