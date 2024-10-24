const Product = require("../models/product.model");

exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Số lượng phải lớn hơn 0', success: false });
    }

    const product = await Product.findById(productId);
    if(!product) {
        return res.status(404).json({
            message: 'Sản phẩm không tồn tại',
            success: false
        })
    }
    
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.product._id.toString() === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subTotal += quantity * existingItem.product.retailPrice;
    } else {
        const item = {
            product: product,
            subTotal: quantity * product.retailPrice,
            quantity,
            price: product.retailPrice
        }

        req.session.cart.push(item);
    }

    res.status(200).json({
        message: 'Sản phẩm đã được thêm vào giỏ hàng',
        cart: req.session.cart,
        success: true
    });
}

exports.updateCart = async (req, res) => {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: 'Số lượng phải lớn hơn 0', success: false });
    }

    const product = await Product.findById(productId);
    if(!product) {
        return res.status(404).json({
            message: 'Sản phẩm không tồn tại',
            success: false
        })
    }
    
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.product._id.toString() === productId);

    if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.subTotal = quantity * existingItem.product.retailPrice;
    } else {
        const item = {
            product: product,
            subTotal: quantity * product.retailPrice,
            quantity,
            price: product.retailPrice
        }

        req.session.cart.push(item);
    }

    res.status(200).json({
        message: 'Sản phẩm đã được thêm vào giỏ hàng',
        cart: req.session.cart,
        success: true
    });
}


exports.getCartSession = async (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }

    return res.status(200).json({
        message: 'Lấy thông tin giỏ hàng',
        cart: req.session.cart,
        success: true
    });  
}

exports.removeItemCart = async (req, res) => {
    const { productId } = req.params;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const existingProductIndex = req.session.cart.findIndex(item => item.product._id.toString() === productId);

    if (existingProductIndex !== -1) {
        req.session.cart.splice(existingProductIndex, 1);
        
        return res.status(200).json({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            cart: req.session.cart,
            success: true
        });
    } else {
        return res.status(404).json({
            message: 'Sản phẩm không có trong giỏ hàng',
            success: false
        });
    }
};