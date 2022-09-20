const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERR_NOT_FOUND } = require('./error-codes/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '632a1a30369aae82e457ecb4',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: 'Данный ресурс не найден' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
