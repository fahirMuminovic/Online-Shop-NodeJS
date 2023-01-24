const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();

//router is like a mini express app and holds all the routes that we specify, then we export the routes and use them in app.js

router.get('/add-product', (req, res, next) => {
	res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
