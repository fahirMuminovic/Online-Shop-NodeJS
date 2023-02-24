const Product = require('../models/product');
const Order = require('../models/order');
const checkForFlashErrors = require('../util/checkForFlashErrors');
const fs = require('fs');
const path = require('path');

exports.getIndex = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				successMessage: checkForFlashErrors(req.flash('success')),
			});
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getProducts = (req, res, next) => {
	Product.find()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				cartItems: user.cart.items,
			});
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then((product) => {
			return req.user.addToCart(product);
		})
		.then((result) => {
			//console.log(result);
			res.redirect('/cart');
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postDeleteCartItem = (req, res, next) => {
	const productId = req.body.productId;
	req.user
		.removeFromCart(productId)
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user.userId': req.user._id })
		.then((orders) => {
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders: orders,
			});
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.then((user) => {
			const products = user.cart.items.map((item) => {
				return {
					quantity: item.quantity,
					productData: { ...item.productId._doc },
				};
			});

			const order = new Order({
				products: products,
				user: {
					username: req.user.username,
					email: req.user.email,
					userId: req.user,
				},
			});
			order.save();
		})
		.then((result) => {
			return req.user.clearCart();
		})
		.then((result) => {
			res.redirect('/orders');
		})
		.catch((err) => {
			const error = new Error();
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	const invoiceName = 'invoice-' + orderId + '.pdf';
	const invoicePath = path.join('data', 'invoices', invoiceName);

	fs.readFile(invoicePath, (err, data) => {
		if (err) return next(err);
		res.setHeader(
			'Content-Disposition',
			'inline; filename="' + invoiceName + '"'
		);
		res.setHeader('Content-Type', 'application/pdf');
		res.send(data);
	});
};
