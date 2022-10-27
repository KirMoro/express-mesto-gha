import { Router } from 'express';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards.js';

export const cardRoutes = Router();

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', likeCard);
cardRoutes.delete('/:cardId/likes', dislikeCard);
