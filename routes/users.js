const router = require('express').Router();

const { userInfoValidation, userAvatarValidation, idValidation } = require('../middlewars/validation');

const {
  getUsers, getUsersById, updateUserProfile, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:_id', idValidation, getUsersById);
router.patch('/users/me', userInfoValidation, updateUserProfile);
router.patch('/users/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
