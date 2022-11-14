import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация.'));
  } else {
    let payload;
    const token = authorization.replace('Bearer ', '');
    const { JWT_SALT } = req.app.get('config');
    try {
      payload = jwt.verify(token, JWT_SALT);
    } catch (err) {
      console.log('error', err.name, err.status)
      next(new UnauthorizedError('Необходима авторизация.'));
    }
    req.user = payload;
    next();
  }
};
