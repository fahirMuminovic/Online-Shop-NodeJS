const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database');

const app = express();
//define the default templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

const errorController = require('./controllers/error');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use((req, res, next) => {
	// User.findByPk(1)
	// 	.then((user) => {
	// 		req.user = user;
	// 		next();
	// 	})
	// 	.catch((err) => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminRoutes.routes);
// app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(process.env.MONGO_URI, (client) => {
	console.log(client);
	app.listen(3000, () => {
		console.log(`App started on http://localhost:3000/`);
	});
});

