const router = require('express').Router();

const {
  findCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', findCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardId);

router.put('/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router; // экспортировали роутер
