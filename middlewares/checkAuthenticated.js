const ALLOWED_ROUTE = ['/login', '/users/login', '/invalid-token']

function checkAuthenticated(req, res, next) {
    if (!req.session.user && ALLOWED_ROUTE.some(route => req.path.startsWith(route))) {
        return next();
    }

    if (req.session.user) {
        next(); 
    } else {
        res.redirect('/login')
    }
}

module.exports = { checkAuthenticated }