const Card = require('../models/card');

const SUCCESS = 200;
const SUCCESS_CREATED = 201;
const VALIDATION_ERROR = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

// Поиск всех карточек
const findCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(SUCCESS).send({ data: card }))
    .catch((err) => res
      .status(SERVER_ERROR)
      .send({ message: `На сервере произошла ошибка ${err}` }));
};

// Создание новой карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })

    .then((card) => card.populate(['owner', 'likes']).then((data) => res.status(SUCCESS_CREATED).send({ data })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR).send({
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
const deleteCardId = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(VALIDATION_ERROR)
          .send({ message: `Переданы некорректные данные: ${err}` });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};

// Поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(VALIDATION_ERROR)
          .send({ message: `Переданы некорректные данные: ${err}` });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};

// Убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(VALIDATION_ERROR)
          .send({ message: `Переданы некорректные данные: ${err}` });
        return;
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `На сервере произошла ошибка ${err}` });
    });
};

module.exports = {
  findCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
