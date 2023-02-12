const bcrypt = require('bcryptjs');

const User = require('../models/user');

const checkErrMsg = require('../util/check-error-message');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		errorMessage: checkErrMsg(req.flash('error')),
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				req.flash('error', 'Invalid e-mail or password.');
				return res.redirect('/login');
			}
			bcrypt
				.compare(password, user.password)
				.then((compareResult) => {
					if (compareResult === true) {
						//passwords match
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							if (err) {
								console.log(err);
							}
							res.redirect('/');
						});
					} else {
						req.flash('error', 'Invalid e-mail or password.');
						res.redirect('/login');
					}
				})
				.catch((err) => {
					console.log(err);
					res.redirect('/login');
				});
		})
		.catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Sign Up',
		isAuthenticated: false,
		errorMessage: checkErrMsg(req.flash('error')),
	});
};

exports.postSignup = (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash('error', 'This e-mail already exists.');
				return res.redirect('/signup');
			} else {
				return bcrypt
					.hash(password, 12)
					.then((hashedPassword) => {
						const user = new User({
							username: username,
							email: email,
							password: hashedPassword,
							cart: {
								items: [],
							},
						});

						return user.save();
					})
					.then((result) => {
						res.redirect('/login');
					});
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
};
