const router = require("express").Router();

const {
  findCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", findCards);
router.post("/cards", createCard);
router.delete("/cards/:cardId", deleteCardId);

router.put("/cards/:cardId/likes", likeCard); // поставить лайк карточке
router.delete("/cards/:cardId/likes", dislikeCard); // убрать лайк с карточки

module.exports = router; // экспортировали роутер
