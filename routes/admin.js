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
		body('title')
			.isString()
			.withMessage('Title must be a string!')
			.isLength({ min: 3 })
			.withMessage('Must be at least 3 letters long')
			.trim(),

		body('productImage')
			.custom((value, { req }) => {
				const mimetype = req.file.mimetype;
				if (
					mimetype === 'image/jpg' ||
					mimetype === 'image/png' ||
					mimetype === 'image/jpeg'
				) {
					return Promise.resolve(true);
				}
			})
			.withMessage('This file type is not supported.'),

		body('price').isFloat().withMessage('Not a valid price!'),
		body('description')
			.isLength({ min: 5 })
			.withMessage('Must be at least 5 letters long')
			.trim(),
	],
	isNotLoggedIn,
	adminController.postAddProduct
);

router.get(
	'/edit-product/:productId',
	isNotLoggedIn,
	adminController.getEditProduct
);

router.post(
	'/edit-product',
	[
		body('title')
			.isString()
			.withMessage('Title must be a string!')
			.isLength({ min: 3 })
			.withMessage('Must be at least 3 letters long')
			.trim(),

		body('productImage')
			.custom((value, { req }) => {
				//on editing it is alowed to not upload a product image
				if (!req.file) {
					return Promise.resolve(true);
				}

				const mimetype = req.file.mimetype;
				if (
					mimetype === 'image/jpg' ||
					mimetype === 'image/png' ||
					mimetype === 'image/jpeg'
				) {
					return Promise.resolve(true);
				}
			})
			.withMessage('This file type is not supported.'),

		body('price').isFloat().withMessage('Not a valid price!'),

		body('description')
			.isLength({ min: 5 })
			.withMessage('Must be at least 5 letters long')
			.trim(),
	],
	isNotLoggedIn,
	adminController.postEditProduct
);

router.post(
	'/delete-product',
	isNotLoggedIn,
	adminController.postDeleteProduct
);

exports.routes = router;
