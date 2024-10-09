function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.session.user.role)) {
            return res.redirect('/403'); 
        }
        next();
    };
}

function isAuthenticated(req, res, next) {
    if (req.path.startsWith('/auth') || req.path.startsWith('/users/login')) {
        return next();
    }

    if (req.session.user) {
        next(); 
    } else {
        res.redirect('/auth/login')
    }
}

module.exports = { authorizeRoles, isAuthenticated }