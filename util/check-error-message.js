const checkErrMsg = (errorMessage) => {
	if (errorMessage.length < 1) {
		return (errorMessage = null);
	} else return errorMessage;
};

module.exports = checkErrMsg;
