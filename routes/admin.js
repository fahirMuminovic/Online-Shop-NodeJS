const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isNotLoggedIn = require('../middleware/isNotLoggedIn');

const router = express.Router();

router.get('/products', isNotLoggedIn, adminController.getProducts);

router.get('/add-product', isNotLoggedIn, adminController.getAddProduct);

router.post(
	'/add-product',
	[
		body('title').isString().withMessage('Title must be a string!').isLength({ min: 3 }).withMessage('Must be at least 3 letters long').trim(),
		body('imgUrl').isURL().withMessage('Not a valid URL!'),
		body('price').isFloat().withMessage('Not a valid price!'),
		body('description').isLength({ min: 5 }).withMessage('Must be at least 5 letters long').trim(),
	],
	isNotLoggedIn,
	adminController.postAddProduct
);

router.get('/edit-product/:productId', isNotLoggedIn, adminController.getEditProduct);

router.post(
	'/edit-product',
	[
		body('title').isString().withMessage('Title must be a string!').isLength({ min: 3 }).withMessage('Must be at least 3 letters long').trim(),
		body('imgUrl').isURL().withMessage('Not a valid URL!'),
		body('price').isFloat().withMessage('Not a valid price!'),
		body('description').isLength({ min: 5 }).withMessage('Must be at least 5 letters long').trim(),
	],
	isNotLoggedIn,
	adminController.postEditProduct
);

router.post('/delete-product', isNotLoggedIn, adminController.postDeleteProduct);

exports.routes = router;
