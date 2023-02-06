const { getDb } = require('../util/database');
const { mongodb, ObjectId } = require('mongodb');

class Product {
	constructor(title, price, imgUrl, description, _id) {
		this.title = title;
		this.price = price;
		this.imgUrl = imgUrl;
		this.description = description;
		this._id = _id ? new ObjectId(_id) : null;
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			//update the product
			dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
		} else {
			//create and insert new product in db
			dbOp = db.collection('products').insertOne(this);
		}
		return dbOp
			.then((result) => {
				console.log(result);
			})
			.catch((err) => console.log(err));
	}

	static findById(productId) {
		const db = getDb();
		return db
			.collection('products')
			.findOne({ _id: new ObjectId(productId) })
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

	static deleteById(productId) {
		const db = getDb();
		return db
			.collection('products')
			.deleteOne({ _id: new ObjectId(productId) })
			.then((result) => {
				console.log(`${result}
			DATABASE ENTRY ${productID} SUCCESSFULLY DELETED`);
			})
			.catch((err) => console.log(err));
	}
}

module.exports = Product;
