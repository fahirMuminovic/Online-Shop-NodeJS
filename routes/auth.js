const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/signup', authController.postSignup);

router.get('/password-reset', authController.getPasswordReset);

router.post('/password-reset', authController.postPasswordReset);

module.exports = router;
