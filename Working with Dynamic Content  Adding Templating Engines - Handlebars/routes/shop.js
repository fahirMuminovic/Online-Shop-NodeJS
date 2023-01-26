const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
	//use the data that an admin has entered in the form on /admin/add-product
	const products = adminData.products;
	//use the shop.pug template for this get request
	//as the second argument to .render we can send data as an key value pare, also it is possible to send multiple key value pares contaning different data
	res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });
});

module.exports = router;

