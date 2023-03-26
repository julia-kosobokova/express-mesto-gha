const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  findUsers,
  findUserId,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser); // возвращает информацию о текущем пользователе

router.get('/:userId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), findUserId);

router.get('/', findUsers);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[\w\-.]+\.\w{2,}([\w\-._~:/?#[\]@!$&'()*+,;=]+)?/),
  }),
}), updateAvatar); // обновляет аватар

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser); // обновляет профиль

module.exports = router; // экспортировали роутер
