const jwt = require('jsonwebtoken');
const Auth = require('../error-codes/Auth');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new Auth('Нужно авторизироваться!');
  }
  req.user = payload;

  next();
};
