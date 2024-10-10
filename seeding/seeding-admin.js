const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const seedAdminAccount = async () => {
    const adminAccount = {
        username: 'admin',
        email: 'hungktpm1406@gmail.com',
        role: 'ADMIN',
        fullName: 'Quản trị viên',
        isActivated: true,
        isPasswordChanged: true,
    };

    const existingAdmin = await User.findOne({ role: 'ADMIN' });

    if (existingAdmin) {
        console.log('Admin account already exists');
        return;
    }

    const hashedPassword = await bcrypt.hash('admin', 10);
    adminAccount.passwordHash = hashedPassword; 

    await User.create(adminAccount);
    console.log('Admin account seeded successfully');
};

exports.seedAdminAccount = seedAdminAccount
