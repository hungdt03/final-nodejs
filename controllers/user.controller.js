const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const path = require('path')
const fs = require('fs');
const { generateToken } = require('../utils/generateToken');
const { sendLinkLogin } = require('../utils/mailService');
const { validateEmail } = require('../utils/validate-email');

require('dotenv').config();

const profilePage = (req, res) => {
    res.render('profile');
};

const accountsPage = async (req, res) => {
    const employees = await User.find()

    const filterEmployees = employees.map(emp => ({
        id: emp._id,
        fullName: emp.fullName,
        email: emp.email,
        avatar: emp.avatar,
        role: emp.role,
        status: emp.status,
        locked: emp.locked,
        isPasswordChanged: emp.isPasswordChanged
    }))

    res.render('account', { employees: filterEmployees });
};

const uploadAvatar = async (req, res) => {
    const existingUser = await User.findOne({ email: req.session.user.email });
    if (!existingUser) {
        return res.redirect('/login')
    }

    let avatar = existingUser.avatar;
    if (req.file) {

        if (avatar) {
            const oldThumbnailPath = path.join(__dirname, '..', 'public/images/avatar/', avatar);
            fs.unlink(oldThumbnailPath, (err) => {
                if (err) console.error('Error deleting old avatar:', err);
            });
        }

        avatar = req.file.filename;
        existingUser.avatar = avatar;
        await existingUser.save()
        req.session.user = {
            ...req.session.user,
            avatar
        }
    }

    return res.redirect('profile')
}

const changeInfo = async (req, res) => {
    const { fullName, email, username } = req.body;

    if (!fullName || !email || !username) {
        return res.render('profile', {
            error_profile: 'Vui lòng nhập đủ thông tin'
        });
    }

    if(!validateEmail(email)) {
        return res.render('profile', {
            error_profile: 'Định dạng email không hợp lệ'
        });
    }

    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/login');

    const isExistedEmail = await User.findOne({
        email: email,
        _id: { $ne: user._id } 
    });

    if (isExistedEmail) {
        return res.render('profile', {
            error_profile: 'Thông tin email đã tồn tại'
        });
    }

    const isExistedUsername = await User.findOne({
        username: username,
        _id: { $ne: user._id } 
    });

    if (isExistedUsername) {
        return res.render('profile', {
            error_profile: 'Thông tin username đã tồn tại'
        });
    }

    user.email = email;
    user.username = username;
    user.fullName = fullName;

    await user.save();

    req.session.user = {
        ...req.session.user,
        email,
        fullName,
        username
    }

    return res.redirect('profile')
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    if(!oldPassword || !newPassword || !confirmPassword) {
        return res.render('profile', {
            error_password: 'Vui lòng nhập đủ thông tin'
        })
    }

    if (newPassword !== confirmPassword) {
        return res.render('profile', {
            error_password: 'Mật khẩu nhập lại không khớp'
        })
    }

    const user = await User.findById(req.session.user._id);
    if (!user) return res.redirect('/login')

    const isMatchPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatchPassword)
        return res.render('profile', {
            error_password: 'Mật khẩu cũ không đúng'
        })

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashPassword;
    await user.save();

    return res.redirect('profile')
}

const toggleLocked = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.render('account', {
                error: 'Nhân viên không tồn tại'
            })
        }

        user.locked = !user.locked;
        await user.save();

        return res.redirect('/users')
    } catch (error) {
        return res.render('account', {
            error: error.message
        })
    }
};


const loginWithLink = async (req, res) => {
    const email = req.query.email;
    const activationToken = req.query.activationToken;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect(`/invalid-token?activationToken=${encodeURIComponent(activationToken)}`)
        }

        const token = user.tokens.find(t =>
            t.token === activationToken &&
            !t.isUsed &&
            t.expiresAt > Date.now()
        );

        if (!token) {
            return res.redirect(`/invalid-token?activationToken=${encodeURIComponent(activationToken)}`)
        }

        token.isUsed = true;
        user.isActivated = true;
        await user.save();

        req.session.user = user;
        return res.redirect('/change-password');
    } catch (error) {
        console.error(error);
        return res.redirect(`/invalid-token?activationToken=${encodeURIComponent(activationToken)}`)
    }
}

const sendLinkAgain = async (req, res) => {
    const { id } = req.params
    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.redirect('/users')
    }

    const activationToken = generateToken()
    const token = {
        token: activationToken,
        isUsed: false,
        createdAt: Date.now(),
        expiresAt: new Date(Date.now() + 36000000)
    };

    existingUser.tokens.push(token);
    await existingUser.save();

    const linkLogin = `${process.env.WEB_URL}/users/login?email=${existingUser.email}&activationToken=${encodeURIComponent(activationToken)}`
    sendLinkLogin(existingUser, linkLogin)

    return res.redirect('/users')
}


module.exports = { profilePage, accountsPage, loginWithLink, uploadAvatar, toggleLocked, sendLinkAgain, changeInfo, changePassword };