const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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

app.use((req, res, next) => {
	User.findById('63e27db2867f89580d025302')
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((err) => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
	.connect(process.env.MONGO_URI)
	.then((result) => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					username: 'Fahir',
					email: 'muminovicfahir@gmail.com',
					cart: {
						items: [],
					},
				});
				user.save();
			}
		});
	})
	.then(
		app.listen(3000, () => {
			console.log(`App started on http://localhost:3000/`);
		})
	)
	.catch((err) => console.log(err));

