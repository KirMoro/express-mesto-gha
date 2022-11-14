import { Router } from 'express';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards.js';
import {celebrateBodyCard, celebrateCardId} from "../validators/cards.js";

export const cardRoutes = Router();

cardRoutes.get('/', getCards);
cardRoutes.post('/', celebrateBodyCard, createCard);
cardRoutes.delete('/:cardId', celebrateCardId, deleteCard);
cardRoutes.put('/:cardId/likes', celebrateCardId, likeCard);
cardRoutes.delete('/:cardId/likes', celebrateCardId, dislikeCard);
