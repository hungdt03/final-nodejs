const checkPasswordChange = (req, res, next) => {
    const user = req.session.user; 

    if (user && !user.isPasswordChanged) {
        const allowedRoutes = ['/auth/change-password', '/auth/logout'];

        if (!allowedRoutes.includes(req.path)) {
            return res.redirect('/auth/change-password');
        }
    }

    next();
}

module.exports = { checkPasswordChange }