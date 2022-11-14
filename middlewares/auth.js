import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ') || !req.cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация.');
  }

  let payload;
  const { JWT_SALT } = req.app.get('config');

  if (req.cookies.jwt) {
    try {
      payload = jwt.verify(req.cookies.jwt, JWT_SALT);
    } catch (err) {
      throw new UnauthorizedError('Необходима авторизация.');
    }
  } else {
    const token = authorization.replace('Bearer ', '');

    try {
      payload = jwt.verify(token, JWT_SALT);
    } catch (err) {
      throw new UnauthorizedError('Необходима авторизация.');
    }
  }

  req.user = payload;
  next();
};
