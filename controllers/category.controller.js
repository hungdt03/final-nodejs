exports.getCategories = (req, res) => {
    res.render('category', { title: 'Category List', items: [] });
};

