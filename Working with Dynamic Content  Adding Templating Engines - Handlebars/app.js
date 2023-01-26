const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const engine = require('express-handlebars');

const app = express();
//define the default templating engine
//for handlebars we need to manually set the views engine
app.engine('handlebars', engine({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout'}));
app.set('view engine', 'handlebars');
app.set('views', './views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
	res.status(404).render('404', { pageTitle: 'Page Not Found!' });
});

app.listen(3000, () => {
	console.log('App started on http://localhost:3000/');
});

