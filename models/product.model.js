const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    barcode: { type: String, required: true },
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 