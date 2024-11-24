const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const path = require('path')
const fs = require('fs');
const { generateToken } = require('../utils/generateToken');
const { sendLinkLogin } = require('../utils/mailService');
const { validateEmail } = require('../utils/validate-email');
const Order = require('../models/order.model');
const { formatDateTime } = require('../utils/formatDatetime');
const { formatCurrencyVND } = require('../utils/formatCurrency');

require('dotenv').config();

const profilePage = (req, res) => {
    res.render('profile');
};

const accountsPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const search = req.query.search || '';

    const skip = (page - 1) * size;
    const searchCondition = search ? {
        fullName: { $regex: search, $options: 'i' }
    } : {};


    const employees = await User.find(searchCondition).skip(skip).limit(size);
    const total = await User.countDocuments(searchCondition);

    const filterEmployees = employees.map(emp => ({
        id: emp._id,
        fullName: emp.fullName,
        email: emp.email,
        avatar: emp.avatar,
        role: emp.role,
        status: emp.status,
        locked: emp.locked,
        isActivated: emp.isActivated,
        isPasswordChanged: emp.isPasswordChanged
    }))

    res.render('account', {
        employees: filterEmployees,
        search,
        pagination: {
            page,
            size,
            total,
            totalPages: Math.ceil(total / size)
        }
    });
};

const accountDetail = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
        return res.redirect('/404')
    }

    const orders = await Order.find({ userId: userId }).populate('customerId').sort({ orderDate: -1 });

    const filterOrders = orders.map(o => ({
        id: o._id,
        orderDate: formatDateTime(o.orderDate),
        totalAmount: formatCurrencyVND(o.totalAmount),
        customer:{
            id: o.customerId._id,   
            fullName: o.customerId.fullName, 
            address: o.customerId.address
        } 
    }))

    res.render('account-detail', {
        employee: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            status: user.status,
            locked: user.locked,
            avatar: user.avatar,
            isActivated: user.isActivated,
            role: user.role
        },
        orders: filterOrders,
        isEmpty: orders.length === 0
    })
}

const uploadAvatar = async (req, res) => {
    
    const existingUser = await User.findById(req.session.user._id);
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

    return res.redirect('/profile')
}

const changeInfo = async (req, res) => {
    const { fullName, email, username } = req.body;

    if (!fullName || !email || !username) {
        return res.render('profile', {
            error_profile: 'Vui lòng nhập đủ thông tin'
        });
    }

    if (!validateEmail(email)) {
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

    req.toastr.success('Cập nhật thông tin thành công', "Thành công!");

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

    if (!oldPassword || !newPassword || !confirmPassword) {
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
    req.toastr.success('Thay đổi mật khẩu thành công', "Thành công!");

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
            console.log('User not found')
            return res.redirect(`/invalid-token?activationToken=${encodeURIComponent(activationToken)}&error=${encodeURIComponent('email not found')}`)
        }

        const token = user.tokens.find(t =>
            t.token === activationToken &&
            !t.isUsed &&
            t.expiresAt > Date.now()
        );


        if (!token) {
            console.log('Token is invalid or expired')
            return res.redirect(`/invalid-token?activationToken=${encodeURIComponent(activationToken)}&error=${encodeURIComponent('invalid')}`)
        }

        token.isUsed = true;
        user.isActivated = true;
        await user.save();

        req.session.user = user;
        return res.redirect('/change-password');
    } catch (error) {
        console.error(error);
        return res.redirect(`/invalid-token?activationToken=${encodeURIComponent(activationToken)}&error=${encodeURIComponent(error)}`)
    }
}

const resendLink = async (req, res) => {
    const { id } = req.params
    const existingUser = await User.findById(id);

    if (!existingUser) {
        return res.redirect('/users')
    }

    if (existingUser.isActivated) {
        req.toastr.error('Tài khoản này đã được kích hoạt', 'Thất bại')
        return res.redirect('/users')
    }

    existingUser.tokens = [];

    const activationToken = generateToken()
    const token = {
        token: activationToken,
        isUsed: false,
        createdAt: Date.now(),
        expiresAt: new Date(Date.now() + 60000)
    };

    existingUser.tokens.push(token);
    await existingUser.save();

    const linkLogin = `${process.env.WEB_URL}/users/login?email=${existingUser.email}&activationToken=${encodeURIComponent(activationToken)}`
    const response = await sendLinkLogin(existingUser, linkLogin)

    if (response) {
        req.toastr.success('Gửi link đăng nhập thành công', "Thành công!");
        console.log('Gửi gmail thành công')
    } else {
        req.toastr.error('Gửi link đăng nhập thất bại', "Thất bại!");
        console.log('Gửi gmail thất bại')
    }

    return res.redirect('/users')
}


module.exports = { accountDetail, profilePage, accountsPage, loginWithLink, uploadAvatar, toggleLocked, resendLink, changeInfo, changePassword };