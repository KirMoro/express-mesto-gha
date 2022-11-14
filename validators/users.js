import { celebrate, Joi } from 'celebrate';

export const celebrateBodyUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
});

export const celebrateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
});

export const celebrateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
});

export const celebrateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

export const celebrateUserId = celebrate({
  params: Joi.string().hex().length(24).required(),
});

export const celebrateUserMe = celebrate({
  params: Joi.string().equal('me'),
});
