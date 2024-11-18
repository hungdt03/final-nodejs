const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");

const PDFDocument = require('pdfkit');
const { formatDateTime } = require("../utils/formatDatetime");

const { formatCurrencyVND } = require("../utils/formatCurrency");
const { default: mongoose } = require("mongoose");
const Product = require("../models/product.model");

exports.ordersList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 8;
    const { from, to, search } = req.query;

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);
    const queryFilter = {};
    if (Object.keys(dateFilter).length) {
        queryFilter.orderDate = dateFilter;
    }
    console.log('Query Filter:', JSON.stringify(queryFilter, null, 2));
    console.log('Search Term:', search); 
    const orders = await Order.find(queryFilter)
        .populate({
            path: 'customerId',
            match: { fullName: { $regex: search || '', $options: 'i' } },
        })
        .sort({ orderDate: -1 })
        .skip((page - 1) * size)
        .limit(size);

    // Lọc những orders không có customerId phù hợp với tìm kiếm
    const filteredOrders = orders.filter(order => order.customerId);

    const total = filteredOrders.length;

    console.log('Filtered Orders:', JSON.stringify(filteredOrders, null, 2));

    const filterOrder = filteredOrders.map(order => ({
        id: order._id,
        totalAmount: formatCurrencyVND(order.totalAmount),
        refundAmount: formatCurrencyVND(order.refundAmount),
        givenAmount: formatCurrencyVND(order.givenAmount),
        orderDate: formatDateTime(order.orderDate),
        customer: {
            fullName: order.customerId.fullName,
            phoneNumber: order.customerId.phoneNumber,
            address: order.customerId.address,
        },
    }));

    return res.render('orders', {
        orders: filterOrder,
        isEmpty: filterOrder.length === 0,
        pagination: {
            page,
            size,
            total,
            totalPages: Math.ceil(total / size),
        },
        from,
        to,
        search,
    });
};

exports.checkout = (req, res) => {
    const carts = req.session.cart ?? []
    const totalPrice = carts.reduce((acc, curr) => acc + curr.subTotal, 0)
    const isEmpty = carts.length === 0

    res.render('checkout', {
        carts: carts.map((item, index) => ({
            ...item,
            no: index + 1,
            subTotal: formatCurrencyVND(item.subTotal),
            price: formatCurrencyVND(item.price)
        })),
        totalPrice: formatCurrencyVND(totalPrice),
        rawTotalPrice: totalPrice,
        isEmpty
    });
};

exports.orderDetail = async (req, res) => {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) return res.redirect('/400')
    const order = await Order.findById(orderId).populate('customerId')
    if (!order) {
        return res.redirect('/404')
    }

    const orderItems = await OrderItem.find({ orderId }).populate('productId');

    const filterOrderItems = orderItems.map((item, index) => {
        return ({
            index: index + 1,
            product: {
                name: item.productId.name,
                thumbnail: item.productId.thumbnail
            },
            quantity: item.quantity,
            price: formatCurrencyVND(item.price),
            subTotal: formatCurrencyVND(item.subTotal)
        })
    });

    const filterOrder = {
        id: order._id,
        totalAmount: formatCurrencyVND(order.totalAmount),
        refundAmount: formatCurrencyVND(order.refundAmount),
        givenAmount: formatCurrencyVND(order.givenAmount),
        orderDate: formatDateTime(order.orderDate),
        customer: {
            fullName: order.customerId.fullName,
            phoneNumber: order.customerId.phoneNumber,
            address: order.customerId.address
        }
    }

    res.render('order-detail', {
        order: filterOrder,
        orderItems: filterOrderItems
    })
}

exports.processCheckout = async (req, res) => {
    const { fullName, phoneNumber, address, totalAmount, givenAmount, refundAmount } = req.body;
    const carts = req.session.cart ?? [];
    const totalPrice = carts.reduce((acc, curr) => acc + curr.subTotal, 0);

    if (carts.length === 0) {
        req.toastr.error('Giỏ hàng trống', "Thất bại!");
        return res.redirect('/orders/checkout')
    }

    if (!phoneNumber || !fullName || !address) {
        req.toastr.error('Vui lòng cung cấp thông tin khách hàng', "Thất bại!");
        return res.redirect('/orders/checkout');
    }

    if (parseFloat(givenAmount) < parseFloat(totalAmount)) {
        req.toastr.error('Số tiền khách đưa phải >= tổng hóa đơn', "Thất bại!");
        return res.redirect('/orders/checkout');
    }

    const session = await Customer.startSession();
    session.startTransaction();

    try {
        let customer = await Customer.findOne({ phoneNumber }).session(session);
        if (!customer) {
            customer = new Customer({
                fullName,
                phoneNumber,
                address
            });
            await customer.save({ session });
        }

        const order = new Order({
            customerId: customer._id,
            givenAmount,
            orderDate: new Date(),
            refundAmount,
            totalAmount,
            userId: req.session.user?._id
        });

        await order.save({ session });

        for (const cartItem of carts) {
            const product = await Product.findById(cartItem.product._id).session(session);

            if (!product) {
                await session.abortTransaction();
                session.endSession();
                req.toastr.error(`Sản phẩm không tồn tại`, 'Thất bại')
                return res.redirect('/orders/checkout');
            }

            if (product.stockQuantity < cartItem.quantity) {
                await session.abortTransaction();
                session.endSession();
                req.toastr.error(`Số lượng tồn kho của sản phẩm ${product.name} không đủ`, 'Thất bại')
                return res.redirect('/orders/checkout');
            } else {
                product.stockQuantity -= cartItem.quantity;
                await product.save({ session })
            }

            const orderItem = new OrderItem({
                orderId: order._id,
                productId: cartItem.product._id,
                quantity: cartItem.quantity,
                price: cartItem.price,
                purchasePrice: cartItem.purchasePrice,
                subTotal: cartItem.subTotal
            });

            await orderItem.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        req.session.cart = []
        req.toastr.success('Thanh toán đơn hàng thành công', "Thành công!");

        res.redirect("/orders/success/" + order._id);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Transaction error: ", error);
        return res.render('checkout', { carts, totalPrice, error: 'Có lỗi xảy ra khi lưu thông tin đơn hàng hoặc khách hàng.' });
    } finally {
        session.endSession();
    }
}

exports.orderSuccess = async (req, res) => {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) return res.redirect('/400')

    const order = await Order.findById(orderId);
    if (!order) {
        return res.redirect('/404')
    }


    return res.render('order-success', {
        order: {
            id: order._id,
            orderDate: formatDateTime(order.orderDate),
            totalAmount: formatCurrencyVND(order.totalAmount)
        }
    });
}

exports.viewInvoice = async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) return res.redirect('/400')

    try {
        const order = await Order.findById(orderId).populate('customerId');
        const orderItems = await OrderItem.find({ orderId }).populate('productId');

        if (!order) {
            return res.status(404).send('Không tìm thấy hóa đơn');
        }

        const doc = new PDFDocument();

        res.setHeader('Content-disposition', `inline; filename=invoice-${orderId}.pdf`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.font('public/fonts/NotoSans/NotoSans-Regular.ttf');

        // Nội dung hóa đơn
        doc.fontSize(20).text(`HOÁ ĐƠN`, { align: 'center' });
        doc.fontSize(10).text(`${order._id}`, { align: 'center' });
        doc.moveDown();
        doc.moveDown();
        doc.fontSize(12).text(`KHÁCH HÀNG: ${order.customerId.fullName}`);
        doc.text(`Số điện thoại: ${order.customerId.phoneNumber}`);
        doc.text(`Địa chỉ: ${order.customerId.address}`);
        doc.text(`Ngày mua hàng: ${formatDateTime(order.orderDate)}`);

        doc.moveDown();
        doc.text('Sản phẩm'.padEnd(50) +
            'Số lượng'.padEnd(10) +
            'Giá tiền'.padEnd(20) +
            'Thành tiền'.padEnd(20));
        doc.text('---------------------------------------------------------------------------------------------------');
        orderItems.forEach(item => {
            doc.text(`${item.productId.name.padEnd(58 - item.productId.name.toString().length)} ${item.quantity.toString().padEnd(10 - item.quantity.toString().length)} ${formatCurrencyVND(item.price).padEnd(28 - formatCurrencyVND(item.price).toString().length)} ${formatCurrencyVND(item.subTotal).toString().padEnd(30 - formatCurrencyVND(item.subTotal).toString().length)}`);
        });

        doc.moveDown();
        doc.text(`Tổng tiền phải trả: ${formatCurrencyVND(order.totalAmount)}`);
        doc.text(`Số tiền khách đưa: ${formatCurrencyVND(order.givenAmount)}`);
        doc.text(`Số tiền thối lại: ${formatCurrencyVND(order.refundAmount)}`);

        doc.end();
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau');
    }
};