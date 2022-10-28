import express from 'express';
import bodyParser from 'body-parser';
import process from 'process';
import mongoose from 'mongoose';
import { constants } from 'http2';
import { userRoutes } from './routes/users.js';
import { cardRoutes } from './routes/cards.js';

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
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

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.all('/*', (req, res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({ message: 'Запрошена несуществующая страница' }));

app.listen(3000);
