const checkForFlashErrors = require('./checkForFlashErrors');

module.exports = (flashErrors) => {
	if (checkForFlashErrors(flashErrors)) {
		const errors = flashErrors.map((error) => {
			return {
				input: error.param,
				msg: error.msg,
			};
		});

		return Array.from(new Set(errors.map((key) => key.input))).map((input) => {
			return errors.find((key) => key.input === input);
		});

	} else return null;
};
