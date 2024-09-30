exports.changePassword = (req, res) => {
    res.render('change-password')
}

exports.login = (req, res) => {
    res.render('login', {
        layout: 'auth', 
    });
}