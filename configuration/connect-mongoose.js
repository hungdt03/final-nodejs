const mongoose = require("mongoose");
const { seedAdminAccount } = require("../seeding/seeding-admin");
const connectionString = process.env.MONGODB_URI;

const connectMongoose = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log('MongoDB connected successfully');
        
        await seedAdminAccount();
        console.log('Seeding admin successfully');
        
    } catch (err) {
        console.error('MongoDB connection error or seeding error:', err);
    }
};

module.exports = connectMongoose