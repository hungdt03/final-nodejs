const User = require('../models/user.model');

require('dotenv').config();


const profilePage = (req, res) => {
    res.render('profile', { title: 'Product List', items: [] });
};

const accountsPage = (req, res) => {
    res.render('account', { title: 'Product List', items: [] });
};

const loginWithLink = async (req, res) => {
    const email = req.query.email;
    const activationToken = req.query.activationToken;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/invalid-token')
        }

        const token = user.tokens.find(t => 
            t.token === activationToken && 
            !t.isUsed && 
            t.expiresAt > Date.now() 
        );

        if (!token) {
            return res.redirect('/invalid-token')
        }

        token.isUsed = true;
        user.isActivated = true;
        await user.save(); 
        
        req.session.user = user; 
        return res.redirect('/auth/change-password'); 
    } catch (error) {
        console.error(error);
        return res.redirect('/invalid-token')
    }
}



module.exports = { profilePage, accountsPage, loginWithLink };