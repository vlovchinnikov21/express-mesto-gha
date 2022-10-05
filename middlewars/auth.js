const jwt = require('jsonwebtoken');
const {
  ERR_AUTH,
} = require('../error-codes/errors');

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    res.status(ERR_AUTH).send({ message: 'Ошибка авторизации' });
  }
  req.user = payload;

  next();
};
