/* const db = require('../util/database');
const Cart = require('./cart');

class Product {
	constructor(id, title, imgUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imgUrl = imgUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		return db.execute('INSERT INTO products (title,price,description,imgUrl) VALUES (?,?,?,?)', [
			this.title,
			this.price,
			this.description,
			this.imgUrl,
		]);
	}

	static deleteById(id) {}

	static fetchAll() {
		return db.execute('SELECT * FROM products');
	}

	static findById(id) {
		return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
	}
}

module.exports = Product;
 */
//gives back a constructor
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false,
	},
	imgUrl: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Product;
