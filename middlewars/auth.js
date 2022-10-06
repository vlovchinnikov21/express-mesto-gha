const jwt = require('jsonwebtoken');
const AuthError = require('../error-codes/AuthError');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new AuthError('Нужно авторизироваться!');
  }
  req.user = payload;

  next();
};
