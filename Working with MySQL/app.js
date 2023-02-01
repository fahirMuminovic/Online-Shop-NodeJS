const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');

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

app.listen(3000, () => {
	console.log('App started on http://localhost:3000/');
});
