const getErrorMessages = (errorMessages) => {
	if (errorMessages.length < 1) {
		return (errorMessages = null);
	} else {
		const msg = errorMessages.map((error) => {
			return {
				input: error.param,
				msg: error.msg,
			};
		});
		console.log(msg);
		return msg;
	}
};

module.exports = getErrorMessages;
