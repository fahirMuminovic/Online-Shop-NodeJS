const Product = require('../models/product');
const getFlashErrorMessages = require('../util/getFlashErrorMessage');
const { validationResult } = require('express-validator');
const fileOperations = require('../util/fileOperations');

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editMode: false,
		errorMessages: [],
		validationErrors: [],
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const uploadedImageFile = req.file;
	const price = req.body.price;
	const description = req.body.description;

	// validation errors on user input
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editMode: false,
			errorMessages: getFlashErrorMessages(errors.array()),
			validationErrors: errors.array(),
			product: {
				title: title,
				price: price,
				description: description,
			},
		});
	}

	// constructor(title, price, imgUrl, description) {
	const product = new Product({
		title: title,
		price: price,
		imagePath: '\\' + uploadedImageFile.path,
		description: description,
		userId: req.user, // in mongoose it is possible to reference the whole user object, mongoose takes the id from this object
	});

	product
		.save()
		.then((result) => {
			console.log(`PRODUCT WITH _id: ${result._id} CREATED SUCCESSFULLY`);
			res.redirect('/admin/products');
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getEditProduct = (req, res, next) => {
	const isInEditMode = req.query.edit;
	const productId = req.params.productId;

	if (!isInEditMode) {
		return res.redirect('/');
	}

	Product.findById(productId)
		.then((product) => {
			if (!product) {
				// TODO: show error page
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editMode: isInEditMode,
				product: product,
				errorMessages: [],
				validationErrors: [],
			});
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedUploadedImageFile = req.file;
	const updatedDescription = req.body.description;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editMode: true,
			errorMessages: getFlashErrorMessages(errors.array()),
			validationErrors: errors.array(),
			product: {
				title: updatedTitle,
				price: updatedPrice,
				description: updatedDescription,
				_id: productId,
			},
		});
	}

	Product.findById(productId)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				// TODO error handling
				throw new Error('Restricted Access!');
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			if (updatedUploadedImageFile) {
				//delete old image
				fileOperations.deleteFile(product.imagePath);

				product.imagePath = '\\' + updatedUploadedImageFile.path;
			}
			product.description = updatedDescription;
			return product.save();
		})
		.then((result) => {
			console.log(`DATABASE ENTRY ${productId} UPDATED SUCCESSFULLY`);
			res.redirect('/admin/products');
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.deleteProduct = (req, res, next) => {
	const productId = req.params.productId;

	Product.findById(productId)
		.then((product) => {
			if (!product) {
				return next(new Error('Product not found!'));
			}
			//delete image from server
			fileOperations.deleteFile(product.imagePath);
			//delete product from db
			return Product.deleteOne({ _id: productId, userId: req.user._id });
		})
		.then((result) => {
			res.status(200).json({
				message: 'Success',
				id: productId,
			})
		})
		.catch((err) => {
			console.log(err);

			res.status(500).json({
				message: 'Product deletion failed',
				id: productId,
			})
		});
};
