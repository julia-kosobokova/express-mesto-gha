const router = require("express").Router();

const {
  findUsers,
  findUserId,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.get("/", findUsers);
router.get("/:userId", findUserId);
router.post("/", createUser);

router.patch("/me", updateUser); // обновляет профиль
router.patch("/me/avatar", updateAvatar); // обновляет аватар

module.exports = router; // экспортировали роутер
