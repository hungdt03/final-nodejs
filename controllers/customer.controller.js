exports.getCustomers = (req, res) => {
    res.render('customer', { title: 'Product List', items: [] });
};