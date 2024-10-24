const bcrypt = require('bcrypt');
const User = require("../models/user.model");
require('dotenv').config();
const { sendLinkLogin } = require("../utils/mailService");
const { generateToken } = require('../utils/generateToken');

exports.createAccount = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ email đã tồn tại'
            })
        }

        const splitEmails = email.split("@")
        const username = splitEmails[0]
        const passwordHash = await bcrypt.hash(username, 10);

        const activationToken = generateToken()
        const token = {
            token: activationToken,
            isUsed: false,
            createdAt: Date.now(),
            expiresAt: new Date(Date.now() + 36000000)
        };

        const newUser = new User({
            username,
            email,
            passwordHash,
            role: 'EMPLOYEE',
            fullName,
            isActivated: false,
            isPasswordChanged: false,
            locked: false,
            tokens: [token]
        });

        await newUser.save();
        req.toastr.success('Tạo tài khoản cho nhân viên thành công', "Thành công!");
        const linkLogin = `${process.env.WEB_URL}/users/login?email=${email}&activationToken=${encodeURIComponent(activationToken)}`
        const response = await sendLinkLogin(newUser, linkLogin)

        if (response) {
            req.toastr.success('Gửi link đăng nhập thành công', "Thành công!");
            console.log('Gửi gmail thành công')
        } else {
            req.toastr.error('Gửi link đăng nhập thất bại', "Thất bại!");
            console.log('Gửi gmail thất bại')
        }

        return res.status(200).json({
            success: true,
            message: 'Vui lòng kiểm tra địa chỉ email'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error
        })
    }
}
