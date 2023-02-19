const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

//disables mongoose warning about strictQuery
mongoose.set('strictQuery', 'false');

//initailize middleware
const app = express();
const sessionStore = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: 'sessions',
});
const csrfProtection = csrf();

//define the default templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

//page not found error controller
const errorController = require('./controllers/error');

//import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//use middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
	})
);
app.use(csrfProtection); //cross site request forgery attacks
app.use(flash()); //error messagess in req.body/sessions

//users and sessions
app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	} else {
		User.findById(req.session.user._id)
			.then((user) => {
				req.user = user;
				next();
			})
			.catch((err) => console.log(err));
	}
});

//authentication and tokens
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();

	req.session.user
		? (res.locals.username = req.session.user.username)
		: (res.locals.username = null);

	next();
});

//routes
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//DB connectiond and app startup
mongoose
	.connect(process.env.MONGO_URI)
	.then((result) => {
		app.listen(3000, () => {
			console.log(`App started on http://localhost:3000/`);
		});
	})
	.catch((err) => console.log(err));
