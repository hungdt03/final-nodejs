const bcrypt = require('bcrypt');

const profilePage = (req, res) => {
    res.render('profile', { title: 'Product List', items: [] });
};

const accountsPage = (req, res) => {
    res.render('account', { title: 'Product List', items: [] });
};

const createAccount = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'Email đã tồn tại.'); 
            return res.redirect('/account'); 
        }

        const splitEmails = email.split("@")
        const username = splitEmails[0]
        const passwordHash = await bcrypt.hash(username, 10);

        const newUser = new User({
            username,
            email,
            passwordHash,
            role: 'EMPLOYEE', 
            fullName,
        });

        // Lưu người dùng vào MongoDB
        await newUser.save();

        req.flash('success_msg', 'Tài khoản đã được tạo thành công!'); // Sử dụng flash message
        res.redirect('/account'); // Redirect về trang account hoặc một trang khác
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản:', error);
        req.flash('error_msg', 'Có lỗi xảy ra trong quá trình tạo tài khoản.'); // Sử dụng flash message
        res.redirect('/account'); // Redirect về trang account hoặc một trang khác
    }
}


module.exports = { profilePage, accountsPage, createAccount };