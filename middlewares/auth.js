import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ') || !req.cookies.jwt) {
      return res
        .status(401)
        .send({ message: 'Необходима авторизация' });
    }

  let payload;
  const { JWT_SALT } = req.app.get('config');

    if (req.cookies.jwt) {
      try {
        payload = jwt.verify(req.cookies.jwt, JWT_SALT);
      } catch (err) {
        return res
          .status(401)
          .send({ message: 'Необходима авторизация' });
      }
    } else {
      const token = authorization.replace('Bearer ', '');

      try {
        payload = jwt.verify(token, JWT_SALT);
      } catch (err) {
        return res
          .status(401)
          .send({ message: 'Необходима авторизация' });
      }
    }

    req.user = payload;
    next();
};
