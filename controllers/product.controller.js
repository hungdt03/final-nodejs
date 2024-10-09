const Product = require('../models/product.model');

exports.showProducts = async (req, res) => {
    try {
        const products = await Product.find({});

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
        
        res.render('product', { products: filteredProducts });
    } catch (error) {
        console.log('Error: ', error)
    }
}
