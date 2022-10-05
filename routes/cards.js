const router = require('express').Router();

const { cardValidation, idValidation } = require('../middlewars/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:_id', idValidation, deleteCard);
router.post('/cards', cardValidation, createCard);
router.put('/cards/:_id/likes', idValidation, likeCard);
router.delete('/cards/:_id/likes', idValidation, dislikeCard);

module.exports = router;
