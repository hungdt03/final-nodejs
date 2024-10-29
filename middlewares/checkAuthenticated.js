const PUBLIC_ROUTE = ['/login', '/users/login', '/invalid-token']

function checkAuthenticated(req, res, next) {
    if (
        (!req.session.user && PUBLIC_ROUTE.some(route => req.path.startsWith(route))) ||
        req.session.user
    ) {
        return next();
    }
    
    res.redirect('/login')
}

module.exports = { checkAuthenticated }