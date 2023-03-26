const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_VALIDATION_RX } = require('../const');

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
    userId: Joi.string().required().hex().length(24),
  }),
}), findUserId);

router.get('/', findUsers);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_VALIDATION_RX),
  }),
}), updateAvatar); // обновляет аватар

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser); // обновляет профиль

module.exports = router; // экспортировали роутер
