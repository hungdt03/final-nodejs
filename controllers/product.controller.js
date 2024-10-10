const Product = require('../models/product.model');
const { formatCurrencyVND } = require('../utils/formatCurrency');
const { formatDateTime } = require('../utils/formatDatetime');

exports.showProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        const filteredProducts = products.map(product => {
            return {
                id: product._id,
                barcode: product.barcode,
                thumbnail: product.thumbnail,
                name: product.name,
                purchasePrice: formatCurrencyVND(product.purchasePrice),
                retailPrice: formatCurrencyVND(product.retailPrice),
                stockQuantity: product.stockQuantity,
                createdAt: formatDateTime(product.createdAt),
                updatedAt: formatDateTime(product.updatedAt)
            };
        });
        
        res.render('product', { products: filteredProducts });
    } catch (error) {
        res.render('500')
    }
}
