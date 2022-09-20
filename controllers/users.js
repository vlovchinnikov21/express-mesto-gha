const User = require('../models/user');
const { ERR_DEFAULT, ERR_BAD_REQUEST, ERR_NOT_FOUND } = require('../error-codes/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERR_DEFAULT).send({ message: 'Ошибка!' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Ошибка валидации' });
      } else if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении информации' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERR_DEFAULT).send({ message: 'Ошибка!' });
      }
    });
};
