const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	const isLoggedIn = req.session.isLoggedIn;
	res.render('auth/login', {
		path: '/login',
		pageTitle: 'Login',
		isAuthenticated: isLoggedIn,
	});
};

exports.postLogin = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save((err) => {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			});
		})
		.catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Sign Up',
		isAuthenticated: false,
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
