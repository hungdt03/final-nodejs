const PRIVATE_ROUTE = ["/users"]
const PUBLIC_ROUTE = ['/login', '/users/login', '/invalid-token']

const checkPermission = (req, res, next) => {
    if (!req.session.user && PUBLIC_ROUTE.some(route => req.path.startsWith(route))) {
        return next();
    }

    const role = req.session.user.role
    if (role === 'EMPLOYEE' && PRIVATE_ROUTE.some(route => req.path === route)) {
        return res.redirect('/403'); 
    }

    next();
}


module.exports = { checkPermission }