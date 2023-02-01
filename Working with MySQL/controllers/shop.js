const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
		.then(([rows]) => {
			res.render('shop/product-list', {
				prods: rows,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId, (product) => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products',
		});
	});
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll()
		//.then(([rows, fieldData]) => {
		.then(([rows]) => {
			res.render('shop/index', {
				prods: rows,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
	Cart.getCart((cart) => {
		Product.fetchAll((products) => {
			const cartItems = [];
			for (let product of products) {
				const cartProductData = cart.products.find((prod) => prod.id === product.id);

				if (cartProductData) {
					cartItems.push({ productData: product, quantity: cartProductData.quantity });
				}
			}

			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				cartItems: cartItems,
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect('/cart');
};

exports.postDeleteCartItem = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, (product) => {
		Cart.deleteProduct(prodId, product.price);
		res.redirect('/cart');
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('/shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout',
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders',
	});
};
