const bcrypt = require('bcrypt');
const User = require("../models/user.model");

exports.changePassword = (req, res) => {
    res.render('change-password')
}

exports.processChangePassword = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if(password !== confirmPassword) {
        return res.render('change-password', {
            error: 'Mật khẩu không khớp'
        })
    }

    const email = req.session.user.email;
    const user = await User.findOne({ email });

    if(!user) {
        return res.render('change-password', {
            error: 'Vui lòng đăng xuất và đăng nhập lại'
        })
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.isPasswordChanged = true;
    await user.save()
    
    req.session.user = {
        ...req.session.user,
        isPasswordChanged: true 
    };

    res.redirect('/')
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
        req.session.user = user; 
        return res.redirect('/'); 

    } catch (error) {
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