import { celebrate, Joi } from 'celebrate';

export const celebrateBodyCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
});

export const celebrateCardId = celebrate({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }).required()
});
