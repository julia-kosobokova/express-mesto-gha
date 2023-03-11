const User = require("../models/user");

const SUCCESS = 200;
const SUCCESS_CREATED = 201;
const VALIDATION_ERROR = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

// Поиск всех пользователей
module.exports.findUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(SUCCESS).send({ data: user }))
    .catch((err) =>
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` })
    );
};

// Поиск пользователя по Id
module.exports.findUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
        return;
      }
      return res.status(SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(VALIDATION_ERROR).send({
          message: `Ошибка поиска пользователя, переданы некорректные данные: ${err}`,
        });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};

// Создание нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCESS_CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(VALIDATION_ERROR).send({
          message: `Ошибка создания пользователя, переданы некорректные данные: ${err}`,
        });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

// Обновление профиля
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  // обновим имя и описание найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    }
  )
  .then((user) => {
    if (user === null) {
      res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
      return;
    }
    return res.status(SUCCESS).send({ data: user });
  })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(VALIDATION_ERROR).send({
          message: `Ошибка обновления пользователя, переданы некорректные данные: ${err}`,
        });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};

// Обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // обновим аватар найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    }
  )
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND).send({ message: "Пользователь не найден" });
        return;
      }
      return res.status(SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(VALIDATION_ERROR).send({
          message: `Ошибка обновления аватара, переданы некорректные данные: ${err}`,
        });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};
