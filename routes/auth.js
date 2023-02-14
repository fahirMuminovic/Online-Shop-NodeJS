const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('The entered e-mail is not valid!')
			.custom((value) => {
				//if user already exists in the database
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('This e-mail already exists.');
					}
				});
			}),

		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must contain at least 6 characters'),

		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords do not match!');
			}
			return true;
		}),
	],
	authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/password-reset', authController.getPasswordReset);

router.post('/password-reset', authController.postPasswordReset);

router.get('/password-reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
