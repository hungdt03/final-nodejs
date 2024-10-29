const Category = require("../models/category.model");
const Product = require("../models/product.model");

exports.getAll = async (req, res) => {
    try {
        const categories = await Category.find();

        const filterCategories = categories.map(category => ({
            id: category._id,
            name: category.name,
            description: category.description,
        }))

        res.status(200).json({
            success: true,
            data: filterCategories,
            message: 'Lấy danh sách danh mục thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lấy danh sách danh mục thất bại'
        });
    }
}

exports.search = async (req, res) => {
    const { search } = req.query;

    try {
        const categories = await Category.find({
            name: { $regex: search, $options: 'i' }
        });

        const filterCategories = categories.map(category => ({
            id: category._id,
            name: category.name,
            description: category.description,
        }))

        return res.status(200).json({
            message: 'Search category successful',
            data: filterCategories,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Search category failed',
            error: error.message,
            success: false
        });
    }
};
exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;

        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đủ thông tin'
            })
        }

        const newCategory = new Category({
            name,
            description,
            createdAt: Date.now()
        });

        await newCategory.save();
        req.toastr.success('Thêm danh mục mới thành công', "Thành công!");
        res.status(201).json({
            success: true,
            data: newCategory,
            message: 'Thêm danh mục mới thành công'
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: 'Thêm danh mục mới thất bại'
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        console.log(name, description)

        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đủ thông tin'
            })
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                name,
                description
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }

        req.toastr.success('Cập nhật danh mục thành công', "Thành công!");
        res.status(200).json({
            success: true,
            data: updatedCategory,
            message: 'Cập nhật danh mục thành công'
        });
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', success: false, });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.find({ categoryId: id });
        if (product.length > 0) {
            req.toastr.error('Không thể xóa danh mục', "Không thể xóa!");
            return res.status(400).json({ message: 'Không thể xóa danh mục, không thể xóa', success: false, });
        }

        const deleteCategory = await Category.findByIdAndDelete(id);

        if (!deleteCategory) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }
        req.toastr.success('Xóa danh mục thành công', "Thành công!");
        res.status(200).json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product', success: false, });
    }
};

exports.getId = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy danh mục'
            });
        }
        res.status(200).json({
            success: true,
            data: category,
            message: 'Lấy thông tin sản phẩm thành công'
        });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching category', success: false, });
    }
}