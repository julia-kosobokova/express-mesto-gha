const Card = require("../models/card");

const SUCCESS = 200;
const SUCCESS_CREATED = 201;
const VALIDATION_ERROR = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

class CardNotFound extends Error {
  constructor() {
    super();
    this.status = NOT_FOUND;
    this.message = "Карточка не найдена";
    this.name = this.constructor.name;
  }
}

// Поиск всех карточек
module.exports.findCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(SUCCESS).send({ data: card }))
    .catch((err) =>
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` })
    );
};

// Создание новой карточки
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link, owner } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(SUCCESS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(VALIDATION_ERROR)
          .send({
            message: `Ошибка создания карточки, переданы некорректные данные: ${err}`,
          });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка: ${err}` });
    });
};

// Удаление карточки по идентификатору
module.exports.deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => res.status(SUCCESS).send({ data: card }))
    .catch((err) => {
      if (err.name === "CardNotFound") {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};

// Поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => res.status(SUCCESS).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(VALIDATION_ERROR)
          .send({ message: `Переданы некорректные данные: ${err}` });
        return;
      }
      if (err.name === "CardNotFound") {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};

// Убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => res.status(SUCCESS).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(VALIDATION_ERROR)
          .send({ message: `Переданы некорректные данные: ${err}` });
        return;
      }
      if (err.name === "CardNotFound") {
        res.status(NOT_FOUND).send({ message: "Карточка не найдена" });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};
