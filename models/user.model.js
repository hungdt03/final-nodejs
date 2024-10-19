const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: { type: String, required: true },  
    createdAt: { type: Date, default: Date.now },  
    expiresAt: { type: Date }, 
    isUsed: { type: Boolean, default: false } 
});

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, required: false },
    role: { 
        type: String, 
        required: true, 
        enum: ['ADMIN', 'EMPLOYEE']
    },
    fullName: { type: String, required: true },
    isActivated: { type: Boolean, required: true },
    isPasswordChanged: { type: Boolean, required: true },
    status: { type: String, default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    locked: { type: Boolean, required: true },
    tokens: [tokenSchema]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
