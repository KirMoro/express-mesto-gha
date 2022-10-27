const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const process = require('process');
const constants = require('http2');
const mongoose = require('mongoose');

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6359a936a6c2b3d7aa044426',
  };

  if (req.headers['Authorization'] || req.headers['authorization']) {
    req.user._id = req.headers['Authorization'] || req.headers['authorization'];
  }

  next();
});

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.listen(3000);

const stop = () => {
  mongoose.connection.close();
  app.close();
  process.exit(0);
};

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
