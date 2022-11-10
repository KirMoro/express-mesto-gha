import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import process from 'process';
import mongoose from 'mongoose';
import { constants } from 'http2';
import { userRoutes } from './routes/users.js';
import { cardRoutes } from './routes/cards.js';
import {createUser, login} from "./controllers/users.js";
import {HTTPError} from "./errors/HTTPError.js";
import * as dotenv from "dotenv";
import * as path from "path";

const { PORT = 3000 } = process.env;

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());

const config = dotenv.config({ path: path.resolve('.env.common') }).parsed;
app.set('config', config);

mongoose.set({ runValidators: true });
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6359a936a6c2b3d7aa044426',
  };

  if (req.headers.Authorization || req.headers.authorization) {
    req.user._id = req.headers.Authorization || req.headers.authorization;
  }

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.all('/*', (req, res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: 'Запрошена несуществующая страница' }));

app.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    res
      .status(err.status)
      .send({message: err.message})
  }

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res
      .status(constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные для удаления карточки.' });
  }
  else {
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'На сервере произошла ошибка.' });
  };
  console.log(err.name)
  next();
});

app.listen(PORT);
