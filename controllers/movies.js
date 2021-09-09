const Movie = require('../models/movie');
const { errMes, message } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
const ConflictErr = require('../errors/conflict');
const ForbiddenErr = require('../errors/forbidden');

// найти все фильмы авторизованного пользователя
function getMovies(req, res, next) {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => {
      if (!movies) {
        throw new NotFoundErr(errMes.notUser);
      }
      return res.status(200).send(movies);
    })
    .catch(next);
}

// добавить фильм
function createMovies(req, res, next) {
  req.body.owner = req.user._id; // записываю id авторизованного пользователя в body.owner

  Movie.findOne({ movieId: req.body.movieId, owner: req.user._id })
    .then((findMovie) => {
      if (findMovie) { // если фильм нашелся, выбрасить ошибку
        throw new ConflictErr(errMes.conflictMovie);
      } else { // иначе, добавить фильм в избранные
        Movie.create(req.body)
          .then((addMovie) => {
            res.status(201).send({ data: addMovie });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestErr(errMes.incorrectData));
            }
            next(err);
          });
      }
    })
    .catch(next);
}

// удалить фильм
function deleteMovies(req, res, next) {
  Movie.findById(req.params.id)
    .then((findMovie) => {
      if (!findMovie) { // фильм не найдена
        throw new NotFoundErr(errMes.notMovie);
      }
      // проверить права авторизованного пользователя на уделение
      if (String(findMovie.owner._id) === String(req.user._id)) {
        Movie.deleteOne(findMovie)
          .then(() => res.status(200).send({ data: { message: message.delMovie } }))
          .catch(next);
      } else {
        throw new ForbiddenErr(errMes.notEnoughRights);
      }
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};
