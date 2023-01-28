const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

const getProductsFromFile = (callBack) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			callBack([]);
		} else {
			callBack(JSON.parse(fileContent));
		}
	});
};

class Product {
	constructor(title, imgUrl, description, price) {
		this.title = title;
		this.imgUrl = imgUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
			});
		});
	}

	static fetchAll(callBack) {
		getProductsFromFile(callBack);
	}
}

module.exports = Product;
