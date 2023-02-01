const fs = require('fs');
const path = require('path');

const filePath = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
	static addProduct(id, productPrice) {
		//fetch previous cart
		fs.readFile(filePath, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };
			if (!err) {
				//if a cart already exists read it from file
				cart = JSON.parse(fileContent);
			}
			//Analyze the cart => find existing products
			const productExistsIndex = cart.products.findIndex((prod) => {
				return prod.id === id;
			});
			const productExists = cart.products[productExistsIndex];
			let newProduct;
			//Add new product/ inrease quantity
			if (productExists) {
				//copy the existing product and add quantity property
				newProduct = { ...productExists };
				newProduct.quantity = newProduct.quantity + 1;
				cart.products = [...cart.products];
				//replace the old product with the updated info about quantity
				cart.products[productExistsIndex] = newProduct;
			} else {
				//create new product with id and quantity properties
				newProduct = { id: id, quantity: 1 };
				//add the new product to the cart.products array
				cart.products = [...cart.products, newProduct];
			}
			//update the price of the cart total
			cart.totalPrice = cart.totalPrice + Number(productPrice);

			//write new cart to file
			fs.writeFile(filePath, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});
	}

	static deleteProduct(id, productPrice) {
		fs.readFile(filePath, (err, fileContent) => {
			if (err) {
				return;
			} else {
				//read cart from file
				const cart = JSON.parse(fileContent);
				//copy cart object
				const updatedCart = { ...cart };
				//find product that is being deleted
				const product = updatedCart.products.find((prod) => prod.id === id);
				//get the quantity of the product that is to be deleted
				const productQuantity = product.quantity;

				//filter out the product from updatedCart that is to be deleted
				updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id);

				//reduce the total price of the cart
				updatedCart.totalPrice = cart.totalPrice - productPrice * productQuantity;

				//write updated cart to file
				fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
					console.log(err);
				});
			}
		});
	}

	static getCart(callBack) {
		fs.readFile(filePath, (err, fileContent) => {
			if (err) {
				callBack([]);
			} else {
				callBack(JSON.parse(fileContent));
			}
		});
	}
};
