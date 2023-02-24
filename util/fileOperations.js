const fs = require('fs');

exports.deleteFile = (path) => {
	if (path[0] === '\\') {
		//remove the first \ from path
		path = path.slice(1);
	}
	fs.unlink(path, (err) => {
		if (err) {
			throw err;
		}
	});
};
