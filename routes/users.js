import { Router } from 'express';
import {
  getUsers, getUserById, updateUserProfile, updateUserAvatar,
} from '../controllers/users.js';

export const userRoutes = Router();

userRoutes.get('/', getUsers);
userRoutes.get('/users/me', getUserById);
userRoutes.get('/:userId', getUserById);
userRoutes.patch('/me', updateUserProfile);
userRoutes.patch('/me/avatar', updateUserAvatar);
