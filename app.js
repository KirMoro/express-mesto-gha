import express from 'express';
import bodyParser from 'body-parser';
import process from 'process';
import mongoose from 'mongoose';
import { constants } from 'http2';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { celebrate, Joi, errors } from 'celebrate';
import { userRoutes } from './routes/users.js';
import { cardRoutes } from './routes/cards.js';
import { createUser, login } from './controllers/users.js';
import { HTTPError } from './errors/HTTPError.js';
import { auth } from './middlewares/auth.js';
import cookieParser from "cookie-parser";

const { PORT = 3000 } = process.env;

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const config = dotenv.config({ path: path.resolve('.env.common') }).parsed;
app.set('config', config);

mongoose.set({ runValidators: true });
mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.all('/*', (req, res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: 'Запрошена несуществующая страница' }));

app.use(errors());
app.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    res
      .status(err.status)
      .send({ message: err.message });
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные для удаления карточки.' });
  } else {
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка.' });
  }
  console.log(err.name);
  next();
});

app.listen(PORT);
