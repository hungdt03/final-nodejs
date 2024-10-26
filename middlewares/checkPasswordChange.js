const PRIORITY_ROUTES = ['/change-password', '/logout', '/users/login', '/invalid-token', '/404'];

const checkPasswordChange = (req, res, next) => {
    const user = req.session.user; 

    if (user && !user.isPasswordChanged) {
        if (!PRIORITY_ROUTES.includes(req.path)) {
            return res.redirect('/change-password');
        }
    }

    next();
}

module.exports = { checkPasswordChange }