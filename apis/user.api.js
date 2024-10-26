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
            expiresAt: new Date(Date.now() + 60000)
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

        const linkLogin = `${process.env.WEB_URL}/users/login?email=${email}&activationToken=${activationToken}`
        const response = await sendLinkLogin(newUser, linkLogin)
        if(response) {
            console.log('Gửi gmail thành công')
        } else {
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
