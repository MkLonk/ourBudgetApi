const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: { // страна создания фильма
    type: String,
    required: true, // обязательное поле
    maxlength: 255,
  },

  director: { // режиссёр фильма
    type: String,
    required: true, // обязательное поле
    minlength: 2,
    maxlength: 255,
  },

  duration: { // длительность фильма
    type: Number, // это число
    required: true, // обязательное поле
  },

  year: { // год выпуска фильма
    type: String,
    required: true, // обязательное поле
    minlength: 2,
    maxlength: 12,
  },

  description: { // описание фильма
    type: String,
    required: true, // обязательное поле
    minlength: 2,
    maxlength: 2048,
  },

  image: { // ссылка на постер к фильму
    type: String,
    required: true, // обязательное поле
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },

  trailer: { // ссылка на трейлер фильма
    type: String,
    required: true, // обязательное поле
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },

  thumbnail: { // миниатюрное изображение постера к фильму
    type: String,
    required: true, // обязательное поле
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },

  owner: { // _id пользователя, который сохранил фильм
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // обязательное поле
  },

  movieId: { // id фильма, который содержится в ответе сервиса MoviesExplorer
    type: Number,
    required: true, // обязательное поле
  },

  nameRU: { // название фильма на русском языке
    type: String,
    required: true, // обязательное поле
    minlength: 2,
    maxlength: 255,
  },

  nameEN: { // название фильма на английском языке
    type: String,
    required: true, // обязательное поле
    minlength: 2,
    maxlength: 255,
  },
});

module.exports = mongoose.model('movie', movieSchema);
