const User = require('../models/user.model');

require('dotenv').config();


const profilePage = (req, res) => {
    res.render('profile', { title: 'Product List', items: [] });
};

const accountsPage = (req, res) => {
    res.render('account', { title: 'Product List', items: [] });
};

const loginWithLink = async (req, res) => {
    console.log('Come here')
    const email = req.query.email;
    const activationToken = req.query.activationToken;
    // const decodeToken = Buffer.from(activationToken, 'base64').toString('utf-8');
    // console.log(decodeToken)
    console.log(email)
    console.log(activationToken)

    try {
        const user = await User.findOne({ email });
        console.log(user)

        if (!user) {
            return res.redirect('/auth/login')
        }

        const token = user.tokens.find(t => 
            t.token === activationToken && 
            !t.isUsed && 
            t.expiresAt > Date.now() 
        );

        console.log(token)

        if (!token) {
            return res.redirect('/auth/login')
        }

       
        token.isUsed = true;
        user.isActivated = true;
        await user.save(); 

        req.session.user = user; 
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.redirect('/auth/login')
    }
}



module.exports = { profilePage, accountsPage, loginWithLink };