const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const User = require('./models/user');

const app = express();
//define the default templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//this is only temporary code
// app.use((req, res, next) => {
// 	User.findById('63e16026557909546b85738e')
// 		.then((user) => {
// 			req.user = new User(user.username, user.email, user.cart, user._id);
// 			next();
// 		})
// 		.catch((err) => console.log(err));
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
	.connect(process.env.MONGO_URI)
	.then(
		app.listen(3000, () => {
			console.log(`App started on http://localhost:3000/`);
		})
	)
	.catch((err) => console.log(err));

