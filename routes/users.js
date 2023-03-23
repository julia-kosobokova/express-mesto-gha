const router = require('express').Router();

const {
  findUsers,
  findUserId,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser); // возвращает информацию о текущем пользователе
router.get('/:userId', findUserId);
router.get('/', findUsers);

router.patch('/me/avatar', updateAvatar); // обновляет аватар
router.patch('/me', updateUser); // обновляет профиль

module.exports = router; // экспортировали роутер
