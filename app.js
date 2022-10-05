const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { auth } = require('./middlewars/auth');
const { login, createUser } = require('./controllers/users');
const { ERR_NOT_FOUND } = require('./error-codes/errors');
const { userValidation, loginValidation } = require('./middlewars/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.post('/signin', loginValidation, login);
app.post('/signup', userValidation, createUser);

app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);
app.use('*', (req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: 'Данный ресурс не найден' });
});

app.use(errors());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
