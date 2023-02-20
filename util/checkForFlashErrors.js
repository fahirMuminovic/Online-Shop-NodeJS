module.exports = (flashErrors) => {
	if (flashErrors.length < 1) {
		return (flashErrors = null);
	} else return flashErrors;
};
