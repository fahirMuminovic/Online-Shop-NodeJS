const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const filePath = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = (callBack) => {
	fs.readFile(filePath, (err, fileContent) => {
		if (err) {
			callBack([]);
		} else {
			callBack(JSON.parse(fileContent));
		}
	});
};

class Product {
	constructor(id, title, imgUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imgUrl = imgUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			//if product with same id exists
			if (this.id) {
				//find product index

				const productExistsIndex = products.findIndex((prod) => {
					return prod.id === this.id;
				});
				//copy products array
				const updatedProducts = [...products];
				console.log(updatedProducts);
				//replace the old product data with the new updated one
				updatedProducts[productExistsIndex] = this;
				fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
					console.log(err);
				});
			} else {
				//when no such product exists give it an id and save to file
				this.id = Math.random().toString();
				products.push(this);
				fs.writeFile(filePath, JSON.stringify(products), (err) => {
					console.log(err);
				});
			}
		});
	}

	static deleteById(id) {
		getProductsFromFile((products) => {
			//store the product that is to be deleted in a variable
			const product = products.find((prod) => prod.id === id);
			//filter out the product with matching id passed to deleteById method
			const updatedProducts = products.filter((prod) => prod.id !== id);

			fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
				if (!err) {
					Cart.deleteProduct(id, product.price);
				} else {
					console.log(err);
				}
			});
		});
	}

	static fetchAll(callBack) {
		getProductsFromFile(callBack);
	}

	static findById(id, callBack) {
		getProductsFromFile((products) => {
			const product = products.find((prod) => prod.id === id);
			callBack(product);
		});
	}
}

module.exports = Product;
