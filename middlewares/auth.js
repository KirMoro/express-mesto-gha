import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  const { JWT_SALT } = req.app.get('config'); // получаем конфиг и вытаскиваем оттуда нужный ключ
  try {
    payload = jwt.verify(token, JWT_SALT);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
