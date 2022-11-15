import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9-._~:/?#\]@!$&'()*+,;=\S]*)/;
const emailRegex = /^([\w]+@([\w-]+\.)+[\w-]{2,4})?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link) => urlRegex.test(link),
      message: () => 'Требуется http(s) ссылка',
    },
  },
  email: {
    type: String,
    unique: true,
    require: true,
    validate: {
      validator: (email) => emailRegex.test(email),
      message: () => 'Введите корректный email',
    },
  },
  password: {
    type: String,
    unique: true,
    require: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((document) => {
      if (!document) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, document.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const user = document.toObject();
          delete user.password;
          return user;
        });
    });
};

export const User = mongoose.model('user', userSchema);
