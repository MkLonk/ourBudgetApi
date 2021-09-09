const errMes = {
  resourceNotFound: 'Ой. Запрашиваемый ресурс не найден.',
  notUser: 'Нет пользователя с таким id',
  notLogin: 'Неправильная почта или пароль.',
  notAuth: 'Необходима авторизация!',
  notMovie: 'Нет фильма с таким id',
  conflictUser: 'Конфликт в БД! Данный email уже используется.',
  conflictMovie: 'Конфликт в БД! Данный фильм уже добавлен в Избранные.',
  incorrectData: 'Переданы некорректные данные.',
  notEnoughRights: 'У клиента нет прав для этого действия.',
  valuesNotChanged: 'Ошибка! Переданные значения полей остались прежними (были не были изменены).',
};

const message = {
  delMovie: 'Фильм удачно удален.',
};

module.exports = { errMes, message };
