const express = require('express');
const { signIn, signUp, likeCard, getLikedCards, getCurrentUser } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Auth
router.post('/signin', signIn);
router.post('/signup', signUp)
router.get('/userLogged', protect, getCurrentUser);

// Related to cards:
router.post('/like/:cardId', protect, likeCard);
router.get('/likedCards', protect, getLikedCards);




module.exports = router;