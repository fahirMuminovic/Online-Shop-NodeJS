const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth');
const User = require('../models/user');
const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();

router.get('/login', isLoggedIn, authController.getLogin);

router.post(
	'/login',
	isLoggedIn,
	[
		body('email')
			.isEmail()
			.withMessage('The entered e-mail is not valid!')
			.normalizeEmail()
			.trim()
			.custom((value) => {
				return User.findOne({ email: value }).then((user) => {
					if (!user) {
						return Promise.reject(
							'No user with this e-mail exists!'
						);
					}
					return Promise.resolve(true);
				});
			}),

		body('password')
			.trim()
			.notEmpty()
			.withMessage('Please enter your password')
			.isLength({ min: 6 })
			.withMessage('Password must contain at least 6 characters')
			.custom((value, { req }) => {
				return new Promise((resolve, reject) => {
					User.findOne({ email: req.body.email })
						.then((user) => {
							if (!user) {
								throw new Error('No user found!');
							} else {
								bcrypt
									.compare(value, user.password)
									.then((compareResult) => {
										if (compareResult === false) {
											return reject('Wrong password!')
										} else {
											return resolve(true);
										}
									});
							}
						})
						.catch((err) => reject(err));
				});
			}),
	],
	authController.postLogin
);

router.get('/signup', isLoggedIn, authController.getSignup);

router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('The entered e-mail is not valid!')
			.normalizeEmail()
			.custom((value) => {
				//if user already exists in the database
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('This e-mail already exists.');
					}
				});
			})
			.trim(),

		body('username')
			.notEmpty()
			.withMessage("Username can't be empty")
			.isAlphanumeric()
			.withMessage('Only letters and numbers are allowed')
			.trim()
			.custom((value) => {
				User.findOne({ username: value })
					.then((user) => {
						if (user) {
							throw new Error('This username is taken.')
						}
						return true;
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}),

		body('password')
			.isLength({ min: 6 })
			.withMessage('Password must contain at least 6 characters')
			.trim(),

		body('confirmPassword')
			.trim()
			.notEmpty()
			.withMessage('Please confirm your password')
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Passwords do not match!');
				}
				return true;
			}),
	],
	isLoggedIn,
	authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get(
	'/password-reset',
	[
		body('email')
			.isEmail()
			.withMessage('The entered e-mail is not valid!')
			.normalizeEmail()
			.trim()
			.custom((value) => {
				return User.findOne({ email: value }).then((user) => {
					if (!user) {
						return Promise.reject(
							'No user with this e-mail exists!'
						);
					}
					return Promise.resolve(true);
				});
			}),
	],
	isLoggedIn,
	authController.getPasswordReset
);

router.post(
	'/password-reset',
	[
		body('email')
			.isEmail()
			.withMessage('The entered e-mail is not valid!')
			.normalizeEmail()
			.custom((value) => {
				//if user already exists in the database
				return User.findOne({ email: value }).then((userDoc) => {
					if (!userDoc) {
						return Promise.reject('No user with this email found.');
					}
				});
			})
			.trim(),
	],
	isLoggedIn,
	authController.postPasswordReset
);

router.get('/password-reset/:token', isLoggedIn, authController.getNewPassword);

router.post(
	'/new-password',
	[
		body('password')
			.trim()
			.custom((value, { req }) => {
				if (value.length === 0) {
					throw new Error('Field is empty!');
				}
				return true;
			})
			.withMessage("This field can't be empty!")
			.isLength({ min: 6 })
			.withMessage('Password must contain at least 6 characters'),

		body('confirmPassword')
			.trim()
			.custom((value, { req }) => {
				if (value.length === 0) {
					throw new Error('Field is empty!');
				}
				return true;
			})
			.withMessage("This field can't be empty!")
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Passwords do not match!');
				}
				return true;
			})
			.withMessage('Passwords do not match!'),
	],
	isLoggedIn,
	authController.postNewPassword
);

module.exports = router;
