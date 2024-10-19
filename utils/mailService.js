const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

const sendLinkLogin = async (user, link, res) => {
    try {
        const mailOptions = {
            from: 'hungktpm1406@gmail.com',
            to: user.email,
            subject: 'Đường link đăng nhập hệ thống',
            text: link,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (err) {
        console.error('Error sending email:', err);
        return false;
    }
}


module.exports = { sendLinkLogin }