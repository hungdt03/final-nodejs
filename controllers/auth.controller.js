const bcrypt = require('bcrypt');
const User = require("../models/user.model");

exports.changePassword = (req, res) => {
    res.render('change-password')
}

exports.loginPage = (req, res) => {
    if(req.session.user) {
        return res.redirect('/');
    }

    res.render('login', {
        layout: 'auth',
    });
}

exports.processLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.render('login', {
                error: 'Thông tin đăng nhập không chính xác',
                username,
                layout: 'auth',
            });
        }

        if(!user.isActivated) {
            return res.render('login', {
                error: 'Vui lòng đăng nhập bằng cách nhấn vào liên kết trong email của bạn',
                username,
                layout: 'auth',
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.render('login', {
                error: 'Thông tin đăng nhập không chính xác',
                username,
                layout: 'auth',
            });
        }

        // Đăng nhập thành công
        req.session.user = user; // Lưu ID người dùng vào session
        return res.redirect('/'); // Chuyển hướng tới trang dashboard

    } catch (error) {
        console.error(error);
        return res.render('login', {
            error: 'Thông tin đăng nhập không chính xác',
            username,
            layout: 'auth',
        });
    }
}

exports.logout = async (req, res) => {
    delete req.session.user;
    res.redirect('/auth/login'); // Redirect đến trang đăng nhập hoặc trang bạn muốn
}