module.exports = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.status(403).render('403', {
			pageTitle: 'Access Restricted!',
			path: '/error403',
		});
	}
	next();
};
