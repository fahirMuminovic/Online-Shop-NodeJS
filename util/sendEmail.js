const emailjs = require('@emailjs/nodejs');
require('dotenv').config();

const sendEmail = (username, shop_name, to_email, emailType, passwordResetLink = null) => {
	const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
	let EMAILJS_TEMPLATE_ID;
	const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
	const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

    if (emailType === 'signup') {
        EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID_SIGNUP;
    }else if (emailType === 'passwordReset') {
        EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID_PASSWORD_RESET;
    }

	const templateParams = {
		username: username,
		shop_name: shop_name,
		to_email: to_email,
        password_reset_link: passwordResetLink,
	};

	emailjs
		.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
			publicKey: EMAILJS_PUBLIC_KEY,
			privateKey: EMAILJS_PRIVATE_KEY, // optional, highly recommended for security reasons
		})
		.then(
			function (response) {
				console.log('SUCCESS!', response.status, response.text);
			},
			function (err) {
				console.log('FAILED...', err);
			}
		);
};

module.exports = {
	sendEmail,
};
