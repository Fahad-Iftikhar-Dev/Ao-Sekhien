import Joi from 'joi';

const objectId = Joi.string().hex().length(24);

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
    'string.empty': 'Current password is required'
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'New password is required',
    'string.empty': 'New password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'New passwords do not match',
    'any.required': 'Confirm password is required',
    'string.empty': 'Confirm password is required'
  })
});

export const categorySchema = Joi.object({
  name: Joi.string().required(),
  nameUrdu: Joi.string().allow('', null),
  nameEnglish: Joi.string().allow('', null),
  icon: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  sortOrder: Joi.number().integer().default(0),
  isActive: Joi.boolean().default(true)
});

export const subcategorySchema = Joi.object({
  categoryId: objectId.required(),
  name: Joi.string().required(),
  nameUrdu: Joi.string().allow('', null),
  nameEnglish: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  sortOrder: Joi.number().integer().default(0),
  isActive: Joi.boolean().default(true)
});

export const contentSchema = Joi.object({
  categoryId: objectId.required(),
  subcategoryId: objectId.required(),
  title: Joi.string().required(),
  titleUrdu: Joi.string().allow('', null),
  titleEnglish: Joi.string().allow('', null),
  arabicText: Joi.string().trim().required().messages({
    'any.required': 'Arabic text is required',
    'string.empty': 'Arabic text is required'
  }),
  urduTranslation: Joi.string().trim().required().messages({
    'any.required': 'Urdu translation is required',
    'string.empty': 'Urdu translation is required'
  }),
  englishTranslation: Joi.string().trim().required().messages({
    'any.required': 'English translation is required',
    'string.empty': 'English translation is required'
  }),
  reference: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
  sortOrder: Joi.number().integer().default(0),
  isActive: Joi.boolean().default(true)
});

export const announcementSchema = Joi.object({
  title: Joi.string().required(),
  message: Joi.string().required(),
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().greater(Joi.ref('startAt')).required(),
  isActive: Joi.boolean().default(true)
});
