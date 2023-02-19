const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

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

// email transporter using mailtrap
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
		successMessage: checkErrMsg(req.flash('success')),
		previousInputs: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);
	
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render('auth/login', {
			path: '/login',
			pageTitle: 'Login',
			isAuthenticated: false,
			errorMessage: errors.array()[0].msg,
			successMessage: checkErrMsg(req.flash('success')),
			previousInputs: {
				email: email,
				password: password,
			},
			validationErrors: errors.array(),
		});
	} else {
		User.findOne({ email: email }).then((user) => {
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
							req.flash('success', 'Successfully loged in!');
							res.redirect('/');
						});
					} else {
						return res.status(422).render('auth/login', {
							path: '/login',
							pageTitle: 'Login',
							isAuthenticated: false,
							errorMessage: 'Wrong email or password',
							successMessage: checkErrMsg(req.flash('success')),
							previousInputs: {
								email: email,
								password: password,
							},
							validationErrors: errors.array(),
						});
					}
				})
				.catch((err) => {
					console.log(err);
					res.redirect('/login');
				});
		});
	}
};

exports.getSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		pageTitle: 'Sign Up',
		isAuthenticated: false,
		errorMessage: checkErrMsg(req.flash('error')),
		previousInputs: {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

exports.postSignup = (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	//input validation result
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			path: '/signup',
			pageTitle: 'Sign Up',
			isAuthenticated: false,
			errorMessage: errors.array()[0].msg,
			previousInputs: {
				username,
				email,
				password,
				confirmPassword: req.body.confirmPassword,
			},
			validationErrors: errors.array(),
		});
	} else {
		//hash password
		bcrypt
			.hash(password, 12)
			.then((hashedPassword) => {
				//create user
				const user = new User({
					username: username,
					email: email,
					password: hashedPassword,
					cart: {
						items: [],
					},
				});
				//save user to db
				return user.save();
			})
			.then((result) => {
				//redirect to login page
				res.redirect('/login');
				//send confirmation email
				return transporter.sendMail({
					to: email,
					from: 'muminovicfahir998@gmail.com',
					subject: 'Signup succeeded!',
					html: '<h1>You successfully sugned up to Node Shop.</h1>',
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
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

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({
		resetToken: token,
		resetTokenExpiration: { $gt: Date.now() },
	})
		.then((user) => {
			res.render('auth/new-password', {
				path: '/new-password',
				pageTitle: 'Reset Password',
				errorMessage: checkErrMsg(req.flash('error')),
				successMessage: checkErrMsg(req.flash('success')),
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch((err) => {
			console.log(err);
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
				req.flash(
					'success',
					'An e-mail with further instructions has been sent. Please check your inbox.'
				);
				res.redirect('/password-reset');

				//send email
				transporter.sendMail({
					to: req.body.email,
					from: 'muminovicfahir998@gmail.com',
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

exports.postNewPassword = (req, res, next) => {
	const userId = req.body.userId;
	const newPassword = req.body.password;
	const confirmNewPassword = req.body.confirmPassword;
	const passwordToken = req.body.passwordToken;
	let resetUser;

	//TODO: check if entered passwords match
	if (newPassword !== confirmNewPassword) {
		req.flash('error', 'Passwords do not match!');
		res.redirect('back');
		//throw new Error('Passwords do not match!');
	} else {
		User.findOne({
			_id: userId,
			resetToken: passwordToken,
			resetTokenExpiration: { $gt: Date.now() },
		})
			.then((user) => {
				if (!user) {
					throw new Error('Something went wrong please try again!');
				}
				resetUser = user;
				return bcrypt.hash(newPassword, 12);
			})
			.then((hashedPassword) => {
				//update password for user
				resetUser.password = hashedPassword;
				//delete password reset token for user
				resetUser.resetToken = undefined;
				resetUser.resetTokenExpiration = undefined;
				return resetUser.save();
			})
			.then((result) => {
				req.flash(
					'success',
					'Password has been successfully reset. Please login.'
				);
				res.redirect('/login');
			})
			.catch((err) => {
				//console.log(err);
				req.flash('error', err.message);
				res.redirect('back');
			});
	}
};
