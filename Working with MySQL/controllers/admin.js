const Product = require('../models/product');

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

	//id, title, price, imgUrl, description
	Product.create({
		title: title,
		price: price,
		imgUrl: imgUrl,
		description: description,
	})
		.then((result) => {
			console.log(result);
			console.log(`Created Product`);
			res.redirect('/admin/products')
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getEditProduct = (req, res, next) => {
	const isInEditMode = req.query.edit;
	const productId = req.params.productId;

	if (!isInEditMode) {
		//TODO: improve this
		return res.redirect('/');
	}

	Product.findByPk(productId)
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

	//constructor(id, title, imgUrl, description, price)
	Product.findByPk(productId)
		.then((product) => {
			product.title = updatedTitle;
			product.imgUrl = updatedImgUrl;
			product.description = updatedDescription;
			product.price = updatedPrice;
			return product.save();
		})
		.then(() => {
			console.log('Product successfully UPDATED');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
	/* 
	const updatedProduct = new Product(
		productId,
		updatedTitle,
		updatedImgUrl,
		updatedDescription,
		updatedPrice
	);

	updatedProduct.save();
	*/
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;

	Product.findByPk(productId)
		.then((product) => {
			product.destroy();
		})
		.then((result) => {
			console.log('Product successfully DELETED');
			res.redirect('/admin/products');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getProducts = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render('admin/products', {
				prods: products,
				pageTitle: 'Admin Products',
				path: '/admin/products',
			});
		})
		.catch((err) => console.log(err));
};
