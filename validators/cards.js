import {celebrate, Joi} from "celebrate";

export const celebrateBodyCard =
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string().uri(),
    }),
  });

export const celebrateCardId = celebrate({
  params: Joi.string().hex().length(24).required(),
});
