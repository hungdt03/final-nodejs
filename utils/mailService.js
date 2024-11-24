const nodemailer = require('nodemailer');

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
            html: `
                <p>Xin chào bạn,</p>
                <p>Bạn vui lòng truy cập vào link bên dưới để thực hiện việc đăng nhập:</p>
                <a href="${link}" target="_blank" style="text-decoration: none; color: #3498db;">Bấm vào đây để đăng nhập</a>
                <div>
                    <strong>Lưu ý: </strong>
                    Link này chỉ có hiệu lực trong vòng 1 phút
                </div>
                <p>Trân trọng,</p>
                <p><strong>Double Hưng Kiên</strong></p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (err) {
        console.error('Error sending email:', err);
        return false;
    }
}

module.exports = { sendLinkLogin };