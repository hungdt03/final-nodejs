exports.getProducts = (req, res) => {
    res.render('product', { title: 'Product List', items: [] });
};