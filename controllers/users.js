import { constants } from 'http2';
import { User } from '../models/user.js';

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `На сервере произошла ошибка. ${err.message}` }));
};

export const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для поиска пользователя.' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка. ${err.message}` });
      }
    });
};

export const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка. ${err.message}` });
      }
    });
};

export const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка. ${err.message}` });
      }
    });
};

export const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        res
          .status(constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res
          .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `На сервере произошла ошибка. ${err.message}` });
      }
    });
};
