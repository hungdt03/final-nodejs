const NOT_ALLOWED_ROUTE = ["/users"]
const ALLOWED_ROUTE = ['/login', '/users/login', '/invalid-token']

const checkPermission = (req, res, next) => {
    if (!req.session.user && ALLOWED_ROUTE.some(route => req.path.startsWith(route))) {
        return next();
    }

    const role = req.session.user.role
    if (role === 'EMPLOYEE' && NOT_ALLOWED_ROUTE.some(route => req.path === route)) {
        return res.redirect('/403'); 
    }

    next();
}


module.exports = { checkPermission }