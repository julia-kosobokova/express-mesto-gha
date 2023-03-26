const Card = require('../models/card');

const { NotFoundError } = require('../errors/not-found-error');
const { ValidationError } = require('../errors/validation-error');
const { ForbiddenError } = require('../errors/forbidden-error');

const SUCCESS = 200;
const SUCCESS_CREATED = 201;

// Поиск всех карточек
const findCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(SUCCESS).send({ data: card }))
    .catch(next);
};

// Создание новой карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })

    .then((card) => card.populate(['owner', 'likes']).then((data) => res.status(SUCCESS_CREATED).send({ data })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(`Ошибка создания карточки, переданы некорректные данные: ${err}`);
      }
      next(err);
    })
    .catch(next);
};

// Удаление карточки по идентификатору
const deleteCardId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbiddenError('Удаление чужой карточки не допускается');
      }
      card.deleteOne()
        .then((data) => res.status(SUCCESS).send({ data }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError(`Переданы некорректные данные: ${err}`);
      }
      next(err);
    })
    .catch(next);
};

// Поставить лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError(`Переданы некорректные данные: ${err}`);
      }
      next(err);
    })
    .catch(next);
};

// Убрать лайк с карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError(`Переданы некорректные данные: ${err}`);
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  findCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
