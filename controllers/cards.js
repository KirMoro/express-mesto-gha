import { constants } from 'http2';
import { Card } from '../models/card.js';
import {HTTPError} from "../errors/HTTPError.js";
import {ServerError} from "../errors/ServerError.js";
import {BadRequestError} from "../errors/BadRequestError.js";
import {NotFoundError} from "../errors/NotFoundError.js";
import {ForbiddenError} from "../errors/ForbiddenError.js";

export const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else {
        next(new ServerError(message));
      }
    });
};

export const createCard = (req, res) => {
  const { name, link } = req.body;
  const newCard = { name, link, owner: req.user._id };
  Card.create(newCard)
    .then((card) => res.status(constants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(new ServerError(message));
      }
    });
};

export const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Отсутствуют права доступа.');
      }
        else res.send(card);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
      } else {
        next(new ServerError(message));
      }
    });
};

export const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      } else res.send(card);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(new ServerError(message));
      }
    });
};

export const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      } else res.send(card);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(new ServerError(message));
      }
    });
};
