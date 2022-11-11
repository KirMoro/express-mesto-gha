import { Router } from 'express';
import {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getUser,
} from '../controllers/users.js';

export const userRoutes = Router();

userRoutes.get('/', getUsers);
userRoutes.get('/users/me', getUser);
userRoutes.get('/:userId', getUserById);
userRoutes.patch('/me', updateUserProfile);
userRoutes.patch('/me/avatar', updateUserAvatar);
