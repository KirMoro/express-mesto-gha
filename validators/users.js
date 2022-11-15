import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../models/user.js';

export const celebrateBodyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const celebrateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const celebrateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }),
  }),
});

export const celebrateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

export const celebrateUserId = celebrate({
  params: Joi.object({
    userId: Joi.alternatives().try(
      Joi.string().equal('me'),
      Joi.string().hex().length(24).required(),
    ).required(),
  }).required(),
});
