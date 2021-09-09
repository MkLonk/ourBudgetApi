const router = require('express').Router();
const { celebrate } = require('celebrate');
const routeUser = require('./users');
const routeMovies = require('./movies');
const routeAllOthers = require('./allOthers');
const auth = require('../middlewares/auth');
const { validSetCreateUser } = require('../middlewares/validSets');
const { login, createUser } = require('../controllers/users');

// открытые роуты
router.post('/signin', celebrate(validSetCreateUser), login); // — роут для логина
router.post('/signup', celebrate(validSetCreateUser), createUser); // роут для регистрации

// авторизация
router.use(auth);

// роуты закрытые авторизацией
router.use('/users', routeUser);
router.use('/movies', routeMovies);
router.use('/*', routeAllOthers);

module.exports = router;
