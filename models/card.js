import mongoose from 'mongoose';

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9]{2,256}\.[a-z]{1,6}\b([-a-zA-Z0-9-._~:/?#\]@!$&'()*+,;=\S]*)/;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => urlRegex.test(link),
      message: () => 'Требуется http(s) ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export const Card = mongoose.model('card', cardSchema);
