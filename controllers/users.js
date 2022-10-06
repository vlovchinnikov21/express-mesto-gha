const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../error-codes/BadRequest');
const NotFound = require('../error-codes/NotFound');
const Conflict = require('../error-codes/Conflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким id не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((avatarData) => res.send({ data: avatarData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'super-strong-secret',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .catch(() => {
      throw new NotFound('Пользователь с таким id не найден');
    })
    .then((currentUser) => res.send({ currentUser }))
    .catch(next);
};
