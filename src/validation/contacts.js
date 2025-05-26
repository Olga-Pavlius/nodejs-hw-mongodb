import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(5).max(20).required(),
  isFavourite: Joi.boolean().optional(),
  gender: Joi.string().valid('male', 'female').optional(),
  year: Joi.number().min(1900).max(2100).optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(5).max(20),
  isFavourite: Joi.boolean(), 
  gender: Joi.string().valid('male', 'female'),
  year: Joi.number().min(1900).max(2100),
}).min(1); 

