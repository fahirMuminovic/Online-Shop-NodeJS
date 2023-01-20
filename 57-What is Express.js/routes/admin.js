const express = require('express');

const router = express.Router();

//router is like a mini express app and holds all the routes that we specify, then we export the routes and use them in app.js

router.get('/add-product', (req, res, next) => {
	res.send(`
    <form action="/product" method="POST">
        <input type="text" name="title">
        <button type="submit">Add Product</button>
    </form>
    `);
});

router.post('/product', (req, res, next) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;
