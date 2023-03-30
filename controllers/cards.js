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

    .then((card) => card.populate(['owner']).then((data) => res.status(SUCCESS_CREATED).send({ data })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Ошибка создания карточки, переданы некорректные данные: ${err}`));
        return;
      }
      next(err);
    });
};

// Удаление карточки по идентификатору
const deleteCardId = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card === null) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (card.owner._id.toString() !== req.user._id) {
        return next(new ForbiddenError('Удаление чужой карточки не допускается'));
      }
      return card.deleteOne()
        .then((data) => res.status(SUCCESS).send({ data }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(`Переданы некорректные данные: ${err}`));
      }
      return next(err);
    });
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
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(`Переданы некорректные данные: ${err}`));
        return;
      }
      next(err);
    });
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
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(`Переданы некорректные данные: ${err}`));
        return;
      }
      next(err);
    });
};

module.exports = {
  findCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
