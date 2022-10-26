const cardRoutes = require('express').Router();
const { getCards, createCard, getCardById } = require('../controllers/cards');

cardRoutes.get('/cards', getCards);
cardRoutes.get('/cards/:cardId', getCardById)
cardRoutes.post('/cards', createCard);

module.exports = cardRoutes;
