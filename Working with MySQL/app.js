const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');

const app = express();
//define the default templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

//makes tables in the db from models
sequelize
	.sync()
	.then((result) => {
		app.listen(3000, () => {
			//console.log(result);
			console.log('App started on http://localhost:3000/');
		});
	})
	.catch((err) => console.log(err));

