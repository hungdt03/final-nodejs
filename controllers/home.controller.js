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