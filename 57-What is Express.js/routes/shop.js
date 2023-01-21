const express = require('express');
//used to get path of views files
const path = require('path');
const rootDir = require('../util/path');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
