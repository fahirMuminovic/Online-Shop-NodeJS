const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('The entered e-mail is not valid!'),

		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must contain at least 6 characters'),
	],
	authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/password-reset', authController.getPasswordReset);

router.post('/password-reset', authController.postPasswordReset);

router.get('/password-reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
