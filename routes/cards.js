const router = require('express').Router();

const { cardValidation, idValidation } = require('../middlewars/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', idValidation, deleteCard);
router.post('/cards', cardValidation, createCard);
router.put('/cards/:cardId/likes', idValidation, likeCard);
router.delete('/cards/:cardId/likes', idValidation, dislikeCard);

module.exports = router;
