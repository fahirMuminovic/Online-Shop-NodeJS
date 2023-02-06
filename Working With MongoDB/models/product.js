const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
	constructor(title, price, imgUrl, description) {
		this.title = title;
		this.price = price;
		this.imgUrl = imgUrl;
		this.description = description;
	}

	save() {
		const db = getDb();
		return db
			.collection('products')
			.insertOne(this)
			.then((result) => {
				console.log(result);
			})
			.catch((err) => console.log(err));
	}

	static findById(productId) {
		const db = getDb();
		return db
			.collection('products')
			.find({ _id: new mongodb.ObjectId(productId) })
			.next()
			.then((product) => {
				return product;
			})
			.catch((err) => console.log(err));
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection('products')
			.find()
			.toArray()
			.then((products) => {
				return products;
			})
			.catch((err) => console.log(err));
	}
}

module.exports = Product;
