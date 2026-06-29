const Joi = require('joi');

const createOrderSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty',
  }),
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-().]{7,20}$/)
    .required()
    .messages({
      'any.required': 'Phone is required',
      'string.pattern.base': 'Invalid phone number format',
    }),
  address: Joi.string().allow('').optional(),
  message: Joi.string().allow('').optional(),
  product: Joi.string().allow('').optional(),
  quantity: Joi.number().integer().min(1).max(99).optional().messages({
    'number.min': 'Quantity must be at least 1',
    'number.max': 'Quantity cannot exceed 99',
  }),
});

module.exports = {
  createOrderSchema,
};
