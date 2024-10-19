const checkPasswordChange = (req, res, next) => {
    const user = req.session.user; 

    if (user && !user.isPasswordChanged) {
        const allowedRoutes = ['/change-password', '/logout', '/users/login', '/invalid-token', '/404'];

        if (!allowedRoutes.includes(req.path)) {
            return res.redirect('/change-password');
        }
    }

    next();
}

module.exports = { checkPasswordChange }