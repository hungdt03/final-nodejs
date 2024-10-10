const Product = require("../models/product.model");

exports.homePage = async (req, res) => {
    const products = await Product.find();

    const filteredProducts = products.map(product => {
        return {
            id: product._id,
            barcode: product.barcode,
            thumbnail: product.thumbnail,
            name: product.name,
            purchasePrice: product.purchasePrice,
            retailPrice: product.retailPrice,
            stockQuantity: product.stockQuantity,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };
    });
    
    res.render('home', { products: filteredProducts, layout: 'sale' });
};

exports.customer = (req, res) => {
    res.render('customer')
}

exports.profile = (req, res) => {
    res.render('profile')
}

exports.report = (req, res) => {
    res.render('report')
}
exports.invalidToken = (req, res) => {
    res.render('invalid-token', {
        layout: null
    })
}