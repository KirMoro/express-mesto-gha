import { Router } from 'express';
import {
  getUsers, createUser, getUserById, updateUserProfile, updateUserAvatar,
} from '../controllers/users.js';

export const userRoutes = Router();

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateUserProfile);
userRoutes.patch('/me/avatar', updateUserAvatar);
