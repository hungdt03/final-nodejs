const fs = require('fs');
const path = require('path');
const Product = require('../models/product.model');
const { randomUUID } = require('crypto');
const OrderItem = require('../models/orderItem.model');
const Category = require('../models/category.model');

exports.getAll = async (req, res) => {
    try {
        const products = await Product.find({});

        res.status(200).json({
            success: true,
            data: products,
            message: 'Lấy danh sách sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lấy danh sách sản phẩm thất bại'
        });
    }
}

exports.search = async (req, res) => {
    const { search } = req.query;
    console.log(search)

    try {
        const products = await Product.find({
            name: { $regex: search, $options: 'i' }
        });

        const filterProducts = products.map(product => ({
            id: product._id,
            name: product.name,
            retailPrice: product.retailPrice,
            thumbnail: product.thumbnail
        }))

        return res.status(200).json({
            message: 'Search product successful',
            data: filterProducts,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Search product failed',
            error: error.message,
            success: false
        });
    }
};
exports.create = async (req, res) => {
    try {
        const { name, purchasePrice, retailPrice, stockQuantity, categoryId } = req.body;

        if(!name || !purchasePrice || !retailPrice || !stockQuantity || !categoryId) {
            return res.status(400).json({
                message: 'Vui lòng nhập đủ thông tin',
                success: false
            })
        }

        const category = await Category.findById(categoryId);

        if(!category) {
            return req.status(404).json({
                success: false,
                message: 'Danh mục không tồn tại'
            })
        }

        const thumbnail = req.file ? req.file.filename : null;

        const newProduct = new Product({
            barcode: randomUUID(),
            name,
            thumbnail,
            purchasePrice,
            retailPrice,
            categoryId,
            stockQuantity,
            updatedAt: Date.now()
        });

        await newProduct.save();
        req.toastr.success('Thêm sản phẩm mới', "Thành công!");
        res.status(201).json({
            success: true,
            data: newProduct,
            message: 'Thêm sản phẩm mới thành công'
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: 'Thêm sản phẩm mới thất bại'
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, purchasePrice, retailPrice, stockQuantity, categoryId } = req.body;

        if(!name || !purchasePrice || !retailPrice || !stockQuantity || !categoryId) {
            return res.status(400).json({
                message: 'Vui lòng nhập đủ thông tin',
                success: false
            })
        }

        const category = await Category.findById(categoryId);
        
        if(!category) {
            return req.status(404).json({
                success: false,
                message: 'Danh mục không tồn tại'
            })
        }

        let thumbnail = req.body.oldThumbnail;

        if (req.file) {
            const oldThumbnailPath = path.join(__dirname, '..', 'public/images/product/', thumbnail);
            fs.unlink(oldThumbnailPath, (err) => {
                if (err) console.error('Error deleting old thumbnail:', err);
            });
            thumbnail = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                thumbnail,
                purchasePrice,
                retailPrice,
                stockQuantity,
                categoryId,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        req.toastr.success('Cập nhật sản phẩm thành công', "Thành công!");
        res.status(200).json({
            success: true,
            data: updatedProduct,
            message: 'Cập nhật sản phẩm thành công'
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Error updating product', success: false, });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const orderItem = await OrderItem.find({ productId: id });
        if (orderItem.length > 0) {
            req.toastr.error('Sản phẩm này đã được mua', "Không thể xóa!");
            return res.status(400).json({ message: 'Sản phẩm này đã được mua, không thể xóa', success: false, });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        req.toastr.success('Xóa sản phẩm thành công', "Thành công!");
        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', success: false, });
    }
};

exports.getId = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('categoryId');
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        const filteredProduct = {
            id: product._id,
            name: product.name,
            retailPrice: product.retailPrice,
            purchasePrice: product.purchasePrice,
            stockQuantity: product.stockQuantity,
            thumbnail: product.thumbnail,
            category: {
                id: product.categoryId._id,
                name: product.categoryId.name
            }
        }
        res.status(200).json({
            success: true,
            data: filteredProduct,
            message: 'Lấy thông tin sản phẩm thành công'
        });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching product', success: false, });
    }
}