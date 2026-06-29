const Joi = require('joi');

const createBouquetSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description cannot be empty',
  }),
  price: Joi.number().positive().required().messages({
    'any.required': 'Price is required',
    'number.positive': 'Price must be a positive number',
  }),
  photoURL: Joi.string().uri().optional(),
  category: Joi.string().optional(),
  is_bestseller: Joi.boolean().optional(),
  favorite: Joi.boolean().optional(),
});

const updateBouquetSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  photoURL: Joi.string().uri().optional(),
  category: Joi.string().optional(),
  is_bestseller: Joi.boolean().optional(),
  favorite: Joi.boolean().optional(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': 'favorite field is required',
    'boolean.base': 'favorite must be a boolean',
  }),
});

module.exports = {
  createBouquetSchema,
  updateBouquetSchema,
  updateFavoriteSchema,
};
