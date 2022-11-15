import { celebrate, Joi } from 'celebrate';

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9-._~:/?#\]@!$&'()*+,;=\S]*)/;

export const celebrateBodyCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(urlRegex).uri({ scheme: ['http', 'https'] }).required(),
  }),
});

export const celebrateCardId = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }).required(),
});
