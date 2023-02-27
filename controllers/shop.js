const Product = require('../models/product');
const Order = require('../models/order');

const checkForFlashErrors = require('../util/checkForFlashErrors');

const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const { createInvoice } = require('../util/createInvoice');

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {
	const page = Number(req.query.page) || 1;
	let totalNumOfProducts;

	Product.find()
		.countDocuments()
		.then((numProducts) => {
			totalNumOfProducts = numProducts;

			return Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE) // pagination
				.limit(ITEMS_PER_PAGE); // pagination
		})
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
				successMessage: checkForFlashErrors(req.flash('success')),
				pagination: {
					totalProducts: totalNumOfProducts,
					currentPage: page,
					hasNextPage: ITEMS_PER_PAGE * page < totalNumOfProducts,
					hasPreviousPage: page > 1,
					nextPage: page + 1,
					previousPage: page - 1,
					lastPage: Math.ceil(totalNumOfProducts / ITEMS_PER_PAGE),
				},
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

	// check if user is trying to download a invoice that does belong to that user
	Order.findById(orderId)
		.then((order) => {
			// no such order found
			if (!order) {
				return next(new Error('No order found!'));
			}
			// check if order belongs to user
			else if (!req.user._id.equals(order.user.userId)) {
				return res.redirect('/403');
			} else {
				//create invoice for this user
				const invoiceName = 'invoice-' + orderId + '.pdf';
				const invoicePath = path.join('data', 'invoices', invoiceName);

				let totalPrice = 0;
				order.products.forEach((product) => {
					totalPrice += product.productData.price * product.quantity;
				});

				const invoice = {
					shipping: {
						name: 'John Doe',
						address: '1234 Main Street',
						city: 'San Francisco',
						state: 'CA',
						country: 'US',
						postal_code: 94111,
					},
					items: order.products,
					subtotal: totalPrice,
					paid: 0,
					invoice_nr: orderId,
				};

				createInvoice(invoice, invoicePath, () => {
					//set response headers
					res.setHeader(
						'Content-Disposition',
						'inline; filename="' + invoiceName + '"'
					);
					res.setHeader('Content-Type', 'application/pdf');

					const file = fs.createReadStream(invoicePath);
					file.pipe(res);
				});
			}
		})
		.catch((err) => {
			console.log(err);
			next(err);
		});
};
