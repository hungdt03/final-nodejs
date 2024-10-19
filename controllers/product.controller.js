const Product = require('../models/product.model');
const { formatCurrencyVND } = require('../utils/formatCurrency');
const { formatDateTime } = require('../utils/formatDatetime');

exports.showProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 8;

        const skip = (page - 1) * size;

        const products = await Product.find().skip(skip).limit(size);
        const total = await Product.countDocuments();

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

        res.render('product', {
            products: filteredProducts,
            pagination: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size)
            }
        });
    } catch (error) {
        res.render('500')
    }
}
