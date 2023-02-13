const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const checkErrMsg = require('../util/check-error-message');

//email transporter using sendgrid api
// const transporter = nodemailer.createTransport(
// 	sendgridTransport({
// 		auth: {
// 			api_key:
// 				'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',
// 		},
// 	})
// );
//email transporter using mailtrap
var transporter = nodemailer.createTransport({
	host: 'sandbox.smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '587a39a9055ac9',
		pass: '4cde68cbc553ef',
	},
});

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
						return transporter.sendMail({
							to: email,
							from: 'node-shop@mail.com',
							subject: 'Signup succeeded!',
							html: '<h1>You successfully sugned up to Node Shop.</h1>',
						});
					})
					.catch((err) => {
						console.log(err);
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

exports.getPasswordReset = (req, res, next) => {
	res.render('auth/password-reset', {
		path: '/password-reset',
		pageTitle: 'Reset Password',
		errorMessage: checkErrMsg(req.flash('error')),
		successMessage: checkErrMsg(req.flash('success')),
	});
};

exports.postPasswordReset = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			throw new Error('Server Error: Please try again');
		}

		const token = buffer.toString('hex');
		User.findOne({ email: req.body.email })
			.then((user) => {
				if (!user) {
					throw new Error('No account with that e-mail found.');
				} else {
					user.resetToken = token;
					user.resetTokenExpiration = Date.now() + 3_600_000;
					return user.save();
				}
			})
			.then((result) => {
				req.flash('success', 'An e-mail with further instructions has been sent. Please check your inbox.')
				res.redirect('/password-reset');
				
				//send email
				transporter.sendMail({
					to: req.body.email,
					from: 'node-shop@mail.com',
					subject: 'Password Reset',
					html: `
						<p>You requested a password reset</p>
						<p>Click this <a href="http://localhost:3000/password-reset/${token}">link</a> to reset your password</p>
						<hr>
						<p>The reset link is only valid for one hour</p>
					`,
				});
			})
			.catch((err) => {
				req.flash('error', err.message);
				return res.redirect('/password-reset');
			});
	});
};
