import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res
        .status(401)
        .send({ message: 'Необходима авторизация' });
    }

    const token = authorization.replace('Bearer ', '');
    let payload;
    const { JWT_SALT } = req.app.get('config');

    try {
      payload = jwt.verify(token, JWT_SALT);
    } catch (err) {
      return res
        .status(401)
        .send({ message: 'Необходима авторизация' });
    }

    req.user = payload;

    next();
  }
  let payload;
  const { JWT_SALT } = req.app.get('config');

  try {
    payload = jwt.verify(req.cookies.jwt, JWT_SALT);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
