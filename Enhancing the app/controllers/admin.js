const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imgUrl = req.body.imgUrl;
	const description = req.body.description;
	const price = req.body.price;

	const product = new Product(title, imgUrl, description, price);
	product.save();
	res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
	const isInEditMode = req.query.edit;
	const productId = req.body.productId;

	if (!isInEditMode) {
		res.redirect('/');
	}

	res.render('admin/edit-product', {
		pageTitle: 'Edit Product',
		path: '/admin/edit-product',
		editMode: isInEditMode,
		productId: productId,
	});
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
		});
	});
};
