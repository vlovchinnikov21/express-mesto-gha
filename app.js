const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewars/auth');
const NotFoundError = require('./error-codes/NotFoundError');
const { userValidation, loginValidation } = require('./middlewars/validation');
const { requestLogger, errorLogger } = require('./middlewars/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);

app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
