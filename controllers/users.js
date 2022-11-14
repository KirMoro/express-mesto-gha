import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { HTTPError } from '../errors/HTTPError.js';
import {NotFoundError} from "../errors/NotFoundError.js";
import {ServerError} from "../errors/ServerError.js";

export const login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SALT } = req.app.get('config');

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SALT,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true
        })
        .end();
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные для пользователя.'));
      } else {
        next(new ServerError(message));
      }
    });
};

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else {
        next(new ServerError(message));
      }
    });
};

export const getUserById = (req, res) => {
  const userId = (req.params.userId === 'me') ? req.user._id : req.params.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else res.send(user);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      }
      else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для поиска пользователя.'));
      }
      else {
        next(new ServerError(message));
      }
    });
};

export const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;

      return User.create(req.body);
    })
    .then((document) => {
      const { password: removed, ...fields } = document.toObject();
      res.send(fields);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(new ServerError(message));
      }
    });
};

export const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else res.send(user);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      }
      else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      else {
        next(new ServerError(message));
      }
    });
};

export const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      } else res.send(user);
    })
    .catch((err) => {
      if (err instanceof HTTPError) {
        next(err);
      }
      else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      }
      else {
        next(new ServerError(message));
      }
    });
};
