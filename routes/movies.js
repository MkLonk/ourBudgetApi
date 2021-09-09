const router = require('express').Router();
const { celebrate } = require('celebrate');

const { validSetCreateMovies, validSetDelMovies } = require('../middlewares/validSets');
const { getMovies, createMovies, deleteMovies } = require('../controllers/movies');

router.get('/', getMovies); // — показать все фильмы в избранном
router.post('/', celebrate(validSetCreateMovies), createMovies); // — добавить фильм в избранные
router.delete('/:id', celebrate(validSetDelMovies), deleteMovies); // — удалить фильм из избранных

module.exports = router;
