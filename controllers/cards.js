import { constants } from 'http2';
import { Card } from '../models/card.js';

export const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка.' }));
};

export const createCard = (req, res) => {
  const { name, link } = req.body;
  const newCard = { name, link, owner: req.user._id };
  Card.create(newCard)
    .then((card) => res.status(constants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

export const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (req.user._id !== card.owner) {
        res
          .status(constants.HTTP_STATUS_FORBIDDEN)
          .send({ message: 'Отсутствуют права доступа.' });
      }
        else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для удаления карточки.' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
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
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
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
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки.' });
      } else res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
