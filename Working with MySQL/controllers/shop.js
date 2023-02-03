const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('shop/product-list', {
				prods: products,
				pageTitle: 'All Products',
				path: '/products',
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findByPk(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: '/products',
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getIndex = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('shop/index', {
				prods: products,
				pageTitle: 'Shop',
				path: '/',
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then((cart) => {
			cart
				.getProducts()
				.then((products) => {
					res.render('shop/cart', {
						path: '/cart',
						pageTitle: 'Your Cart',
						cartItems: products,
					});
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;
	req.user
		.getCart()
		.then((cart) => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: prodId } });
		})
		.then((cartItems) => {
			let cartItem;
			if (cartItems.length > 0) {
				cartItem = cartItems[0];
			}

			if (cartItem) {
				const oldQuantity = cartItem.cartItem.quantity;
				newQuantity = oldQuantity + 1;
				return cartItem;
			} else {
				return Product.findByPk(prodId);
			}
		})
		.then((cartItem) => {
			return fetchedCart.addProduct(cartItem, { through: { quantity: newQuantity } });
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
	const productId = req.body.productId;
	req.user
		.getCart()
		.then((cart) => {
			return cart.getProducts({ where: { id: productId } });
		})
		.then((products) => {
			const product = products[0];

			return product.cartItem.destroy();
		})
		.then((result) => {
			res.redirect('/cart');
		})
		.catch((err) => console.log(err));
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
