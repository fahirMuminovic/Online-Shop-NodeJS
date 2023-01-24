const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
	/* console.log(adminData.products);
  res.sendFile(path.join(rootDir, 'views', 'shop.html')); */
	//use the shop.pug template for this get request
	res.render('shop');
});

module.exports = router;

