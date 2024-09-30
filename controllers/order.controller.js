exports.checkout = (req, res) => {
    res.render('checkout', { title: 'Product List', items: [] });
};