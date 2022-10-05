const Card = require('../models/card');
const { ERR_DEFAULT, ERR_BAD_REQUEST, ERR_NOT_FOUND } = require('../error-codes/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERR_DEFAULT).send({ message: 'Ошибка!' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params._id)
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }))
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params._id)
          .then((cards) => res.send(cards));
      } else {
        res.status(ERR_BAD_REQUEST).send({ message: 'Ошибка удаления' });
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные лайка' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }))
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные дизлайка' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};
