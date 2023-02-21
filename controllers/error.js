exports.get404 = (req, res, next) => {
	res.status(404).render('404', {
		pageTitle: 'Page Not Found!',
		path: '/error404',
	});
};

exports.get500 = (req, res, next) => {
	res.status(500).render('500', {
		pageTitle: 'Unexpected Error!',
		path: '/error500',
	});
};