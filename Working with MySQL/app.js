const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();
//define the default templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
	User.findByPk(1)
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });
//makes tables in the db from models
sequelize
	//.sync({ force: true })
	.sync()
	.then((result) => {
		//creating a placeholder user for now
		return User.findByPk(1);
	})
	.then((user) => {
		//this is only temporary to test the app
		if (!user) {
			return User.create({ name: 'Fahir', email: 'muminovicfahir998@gmail.com' });
		}
		return Promise.resolve(user);
	})
	.then((user) => {
		return user.createCart();
	})
	.then((cart) => {
		app.listen(3000, () => {
			console.log('App started on http://localhost:3000/');
		});
	})
	.catch((err) => console.log(err));

