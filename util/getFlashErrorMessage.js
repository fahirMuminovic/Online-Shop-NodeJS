const checkForFlashErrors = require('./checkForFlashErrors');

module.exports = (flashErrors) => {
	if (checkForFlashErrors(flashErrors)) {
		const msg = flashErrors.map((error) => {
			return {
				input: error.param,
				msg: error.msg,
			};
		});
		return msg;
		
	} else return null;
};
