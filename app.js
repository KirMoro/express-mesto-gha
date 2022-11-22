import express from 'express';
import bodyParser from 'body-parser';
import process from 'process';
import mongoose from 'mongoose';
import { constants } from 'http2';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import { userRoutes } from './routes/users.js';
import { cardRoutes } from './routes/cards.js';
import { createUser, login } from './controllers/users.js';
import { auth } from './middlewares/auth.js';
import { celebrateBodyUser, celebrateLoginUser } from './validators/users.js';
import { NotFoundError } from './errors/NotFoundError.js';
import {requestLogger} from "./middlewares/logger.js";
import {errorLogger} from "express-winston";
import cors from "cors";

const { PORT = 3000 } = process.env;

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
));
const config = dotenv.config({ path: path.resolve('.env.common') }).parsed;
app.set('config', config);

mongoose.set({ runValidators: true });
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(requestLogger);
app.post('/signup', celebrateBodyUser, createUser);
app.post('/signin', celebrateLoginUser, login);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.all('/*', (req, res, next) => next(new NotFoundError('Запрошена несуществующая страница')));
app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const status = err.status || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || 'Неизвестная ошибка';
  res.status(status).send({ message });
  next();
});

app.listen(PORT);
