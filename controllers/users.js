const { NODE_ENV, JWT_SECRET, SALT_ROUNDS = 10 } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errMes } = require('../utils/constants');
const NotFoundErr = require('../errors/notFound');
const BadRequestErr = require('../errors/badRequest');
const ConflictErr = require('../errors/conflict');
const UnauthorizedErr = require('../errors/unauthorized');

// возвращает аворизованного пользователя
function getMe(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr(errMes.notUser);
      }
      return res.status(200).send(user);
    })
    .catch(next);
}

// обновляет name и email пользователя
function patchMe(req, res, next) {
  const { name, email } = req.body;

  // ещем авторизованного пользователя
  User.findById(req.user._id)
    .then((authUser) => {
      // если данны (name или email) не были изменены
      if (name === authUser.name || email === authUser.email) {
        // выбросить ошибку
        throw new BadRequestErr(errMes.valuesNotChanged);
      }

      // если был передан только email
      if (email && !name) {
        User.findOne({ email }) // проверяем на конфликт в бд
          .then((findUser) => {
            if (findUser) { // если email уже используется в бд
              // выбросить ошибку
              throw new ConflictErr(errMes.conflictUser);
            }
            // email будет изменен
            User.findByIdAndUpdate(req.user._id, { email }, { new: true, runValidators: true })
              .then((updatedUser) => res.status(201).send(updatedUser))
              .catch((err) => {
                if (err.name === 'ValidationError') { // если ошибка валидации
                  return next(new BadRequestErr(errMes.incorrectData));
                }
                return next(err);
              });
          })
          .catch(next);

        // если был передан только name
      } else if (name && !email) {
        User.findByIdAndUpdate(req.user._id, { name }, { new: true, runValidators: true }) //+
          .then((updatedUser) => res.status(201).send(updatedUser))
          .catch((err) => {
            if (err.name === 'ValidationError') { // если ошибка валидации
              return next(new BadRequestErr(errMes.incorrectData));
            }
            return next(err);
          });

        // если были переданы и name, и email
      } else {
        User.findOne({ email }) // проверяем email на конфликт в бд
          .then((findUser) => {
            if (findUser) { // если email уже используется в бд
              // выбросить ошибку
              throw new ConflictErr(errMes.conflictUser);
            }
            // email и name будут изменены
            User.findByIdAndUpdate(req.user._id, { name, email },
              { new: true, runValidators: true })
              .then((updatedUser) => res.status(201).send(updatedUser))
              .catch((err) => {
                if (err.name === 'ValidationError') { // если ошибка валидации
                  return next(new BadRequestErr(errMes.incorrectData));
                }
                return next(err);
              });
          })
          .catch(next);
      }
    })
    .catch(next);
}

// создаёт пользователя
function createUser(req, res, next) {
  const { name, email, password } = req.body;

  bcrypt.hash(password, Number(SALT_ROUNDS)) // хешируем пароль
    .then((hashPass) => User.create({ name, email, password: hashPass }))
    .then(() => res.status(201).send({ data: { name, email } }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(errMes.incorrectData));
      } else if (err.name === 'MongoError') {
        next(new ConflictErr(errMes.conflictUser));
      } else {
        next(err);
      }
    });
}

// контроллер login для аутентификации пользователя +
function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.status(201).send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      next(new UnauthorizedErr(errMes.notLogin));
    });
}

module.exports = {
  getMe,
  patchMe,
  createUser,
  login,
};
