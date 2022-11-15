import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация.');
  }
  const token = authorization.replace(/^Bearer\s/i, '');
  let payload;

  const { JWT_SALT } = req.app.get('config');
  try {
    payload = jwt.verify(token, JWT_SALT);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }
  req.user = payload;
  next();
};
