const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hungktpm1406@gmail.com',
        pass: 'wfquklbxrzkrzymy',
    },
});

const sendLinkLogin = (user, link, res) => {

    const mailOptions = {
        from: 'hungktpm1406@gmail.com',
        to: user.email,
        subject: 'Đường link đăng nhập hệ thống',
        text: link,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        console.log(error)
        console.log(info)
    });
}


module.exports = { sendLinkLogin }