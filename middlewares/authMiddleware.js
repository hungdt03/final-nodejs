const PUBLIC_ROUTE = ['/login', '/users/login', '/invalid-token'];
const PRIORITY_ROUTES = ['/change-password', '/logout', '/users/login', '/invalid-token', '/404'];
const PRIVATE_ROUTE = ["/users"];

function authMiddleware(req, res, next) {
    const user = req.session.user;

    // 1. Kiểm tra xác thực cho các PUBLIC_ROUTE
    if (!user && PUBLIC_ROUTE.some(route => req.path.startsWith(route))) {
        return next();
    }

    // 2. Kiểm tra người dùng chưa đăng nhập, redirect đến trang đăng nhập
    if (!user) {
        return res.redirect('/login');
    }

    // 3. Kiểm tra thay đổi mật khẩu chưa
    if (user && !user.isPasswordChanged && !PRIORITY_ROUTES.includes(req.path)) {
        return res.redirect('/change-password');
    }

    // 4. Kiểm tra quyền truy cập cho nhân viên (EMPLOYEE) vào các PRIVATE_ROUTE
    if (user.role === 'EMPLOYEE' && PRIVATE_ROUTE.some(route => req.path === route)) {
        return res.redirect('/403');
    }

    // Nếu tất cả các kiểm tra đều thông qua
    next();
}

module.exports = { authMiddleware };
