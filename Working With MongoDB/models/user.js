const { getDb } = require('../util/database');
const { ObjectId } = require('mongodb');

class User {
	constructor(username, email, cart, _id) {
		this.username = username;
		this.email = email;
		this.cart = cart;
		this._id = _id;
	}

	save() {
		const db = getDb();
		return db.collection('users').insertOne(this);
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex((cartProduct) => {
			return cartProduct.productId.toString() === product._id.toString();
		});
		
		let newQuantity = 1;
		const updatedItems = [...this.cart.items];

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
		}

		const updatedCart = {
			items: updatedItems,
		};

		const db = getDb();

		return db
			.collection('users')
			.updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
	}

	static findById(userId) {
		const db = getDb();
		return db
			.collection('users')
			.findOne({ _id: new ObjectId(userId) })
			.then((user) => {
				//console.log(user);
				return user;
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = User;
