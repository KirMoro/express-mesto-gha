import { celebrate, Joi } from 'celebrate';

export const celebrateBodyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

export const celebrateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

export const celebrateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
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
    id: Joi.string().hex().length(24).required(),
  }).required(),
});

export const celebrateUserMe = celebrate({
  params: Joi.object({
    id: Joi.string().equal('me'),
  }).required(),
});
