const fs = require('fs');
const path = require('path');

const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
}

exports.showAddForm = (req, res) => {
    res.render('product-form', { title: 'Thêm Sản Phẩm' });
};

exports.getId = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching product', error: err });
    }
}
exports.create = async (req, res) => {
    try {
        const { barcode, name, purchasePrice, retailPrice, stockQuantity } = req.body;
        const thumbnail = req.file ? '/images/product/' + req.file.filename : null;

        const newProduct = new Product({
            barcode,
            name,
            thumbnail,
            purchasePrice,
            retailPrice,
            stockQuantity,
            updatedAt: Date.now()
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error creating product', error: err });
    }
};

exports.showEditForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('product-form', { title: 'Chỉnh Sửa Sản Phẩm', product });
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { barcode, name, purchasePrice, retailPrice, stockQuantity } = req.body;
        let thumbnail = req.body.oldThumbnail;

        if (req.file) {
            const oldThumbnailPath = path.join(__dirname, '..', 'public', thumbnail);
            fs.unlink(oldThumbnailPath, (err) => {
                if (err) console.error('Error deleting old thumbnail:', err);
            });
            thumbnail = '/images/product/' + req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { 
                barcode, 
                name, 
                thumbnail, 
                purchasePrice, 
                retailPrice, 
                stockQuantity,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err.message });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', error: err });
    }
};