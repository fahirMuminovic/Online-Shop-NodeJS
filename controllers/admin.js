const Product = require('../models/product');
const getFlashErrorMessages = require('../util/getFlashErrorMessage');
const { validationResult } = require('express-validator');

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((err) => console.log(err));
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
	const imgUrl = req.body.imgUrl;
	const price = req.body.price;
	const description = req.body.description;
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
				imgUrl: imgUrl,
				price: price,
				description: description,
			},
		});
	}

	//constructor(title, price, imgUrl, description) {
	const product = new Product({
		title: title,
		price: price,
		imgUrl: imgUrl,
		description: description,
		userId: req.user, //in mongoose it is possible to reference the whole user object, mongoose takes the id from this object
	});

	product
		.save()
		.then((result) => {
			console.log(`PRODUCT CREATED SUCCESSFULLY`);
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
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
				//TODO: show error page
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
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;

	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImgUrl = req.body.imgUrl;
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
				imgUrl: updatedImgUrl,
				price: updatedPrice,
				description: updatedDescription,
				_id: productId,
			},
		});
	}

	Product.findById(productId)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				//TODO error handeling
				throw new Error('Restricted Access!');
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.imgUrl = updatedImgUrl;
			product.description = updatedDescription;
			return product.save();
		})
		.then((result) => {
			console.log(`DATABASE ENTRY ${productId} UPDATED SUCCESSFULLY`);
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
			return res.redirect('/');
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;

	Product.deleteOne({ _id: productId, userId: req.user._id })
		.then((product) => {
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
			res.redirect('/');
		});
};
