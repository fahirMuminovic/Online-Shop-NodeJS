const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
				isAuthenticated: req.session.isLoggedIn,
			});
		})
		.catch((err) => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editMode: false,
		isAuthenticated: req.session.isLoggedIn,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imgUrl = req.body.imgUrl;
	const price = req.body.price;
	const description = req.body.description;

	//constructor(title, price, imgUrl, description) {
	const product = new Product({
		title: title,
		price: price,
		imgUrl: imgUrl,
		description: description,
		userId: req.user,  //in mongoose it is possible to reference the whole user object, mongoose takes the id from this object 
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
				isAuthenticated: req.session.isLoggedIn,
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

	Product.findById(productId)
		.then((product) => {
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
		.catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;

	Product.findByIdAndRemove(productId)
		.then(() => {
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};
