// import Joi from 'joi';

// export const createContactSchema = Joi.object({
//   name: Joi.string().min(3).max(30).required(),
//   age: Joi.number().integer().min(6).max(16).required(),
//   gender: Joi.string().valid('male', 'female', 'other').required(),
//   avgMark: Joi.number().min(2).max(12).required(),
//   onDuty: Joi.boolean(),
// });

import Joi from 'joi';

// Оголошення схеми з кастомізованими повідомленнями
export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username should be a string', // Кастомізація повідомлення для типу "string"
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.number().integer().min(6).max(16).required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.required': 'Поле "contactType" є обов’язковим',
      'any.only': 'Поле "contactType" повинно бути одним із: work, home, personal',
      'string.base': 'Поле "contactType" має бути рядком',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phoneNumber: Joi.number().integer().min(6).max(16).required(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .messages({
      'any.required': 'Поле "contactType" є обов’язковим',
      'any.only': 'Поле "contactType" повинно бути одним із: work, home, personal',
      'string.base': 'Поле "contactType" має бути рядком',
    }),
});