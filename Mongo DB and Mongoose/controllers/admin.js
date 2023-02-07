const { ObjectId } = require('mongodb');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
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
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imgUrl = req.body.imgUrl;
	const price = req.body.price;
	const description = req.body.description;

	//constructor(title, price, imgUrl, description, userId, _id) {
	const product = new Product(title, price, imgUrl, description, req.user._id, null);

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
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const productId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedImgUrl = req.body.imgUrl;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;

	//constructor(title, price, imgUrl, description, _id)
	const product = new Product(
		updatedTitle,
		updatedPrice,
		updatedImgUrl,
		updatedDescription,
		productId
	);
	product
		.save()
		.then((result) => {
			console.log(`DATABASE ENTRY ${productId} UPDATED SUCCESSFULLY`);
			res.redirect('/admin/products');
		})
		.catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;

	Product.deleteById(productId)
		.then(() => {
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};
