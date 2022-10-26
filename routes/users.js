const userRoutes = require('express').Router();
const { getUsers, createUser } = require('../controllers/users');

userRoutes.get('/', getUsers);

userRoutes.post('/users', createUser);

module.exports = userRoutes;
