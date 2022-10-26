const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', userRoutes);

app.use((req, res, next) => {
  req.user = { // хардкод для тестов
    _id: '6359a936a6c2b3d7aa044426',
  };

  // псевдоавторизация
  if (req.headers['Authorization'] || req.headers['authorization']) {
    req.user._id = req.headers['Authorization'] || req.headers['authorization'];
  }

  next();
});


app.listen(3000);
