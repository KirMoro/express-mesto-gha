import { celebrate, Joi } from 'celebrate';

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9-._~:/?#\]@!$&'()*+,;=\S]*)/;

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
