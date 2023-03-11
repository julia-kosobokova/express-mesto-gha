const router = require("express").Router();

const {
  findUsers,
  findUserId,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.get("/users", findUsers);
router.get("/users/:userId", findUserId);
router.post("/users", createUser);

router.patch("/users/me", updateUser); // обновляет профиль
router.patch("/users/me/avatar", updateAvatar); // обновляет аватар

module.exports = router; // экспортировали роутер
