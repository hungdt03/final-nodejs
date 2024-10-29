const Category = require("../models/category.model");

exports.showCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 6;
        const search = req.query.search || '';

        const skip = (page - 1) * size;
        const searchCondition = search ? {
            name: { $regex: search, $options: 'i' } 
        } : {};

        const categories = await Category.find(searchCondition).skip(skip).limit(size);
        const total = await Category.countDocuments(searchCondition);

        const filterCategories = categories.map(category => {
            return {
                id: category._id,
                name: category.name,
                description: category.description,
            };
        });



        res.render('category', {
            categories: filterCategories,
            search,
            pagination: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size)
            }
        });
    } catch (error) {
        console.log(error)
        res.render('500')
    }
}
