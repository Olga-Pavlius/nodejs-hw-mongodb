import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  isFavourite: Joi.boolean().optional(),
  gender: Joi.string().valid('male', 'female').optional(),
  year: Joi.number().integer().optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  isFavourite: Joi.boolean(), // додано
  gender: Joi.string().valid('male', 'female'),
  year: Joi.number().integer(),
}).min(1);
