const Customer = require('../models/customer.model');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const { formatCurrencyVND } = require('../utils/formatCurrency');
const { formatDateTime } = require('../utils/formatDatetime');

exports.getCustomers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    try {
        const customers = await Customer.find().skip((page - 1) * size).limit(size);

        const total = await Customer.countDocuments();
        const plainCustomers = customers.map(customer => customer.toObject())
        res.render('customer', {
            customers: plainCustomers, isEmpty: customers.length === 0,
            pagination: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size)
            }
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.customerDetail = async (req, res) => {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.redirect('/404')
    const orders = await Order.find({
        customerId
    }).sort({ orderDate: -1 })

    const filterOrders = orders.map(o => ({
        id: o._id,
        orderDate: formatDateTime(o.orderDate),
        totalAmount: formatCurrencyVND(o.totalAmount),
        refundAmount: formatCurrencyVND(o.refundAmount),
        givenAmount: formatCurrencyVND(o.givenAmount),
    }))

    res.render('customer-detail', {
        orders: filterOrders,
        customer: {
            fullName: customer.fullName,
            address: customer.address,
            phoneNumber: customer.phoneNumber
        },
        isEmpty: orders.length === 0
    })

}

// exports.getCustomerOrder = async (phoneNumber) => {
//     try {
//         const customer = await Customer.findOne({ phoneNumber });
//         if (!customer) {
//             return { error: 'Không tìm thấy khách hàng', status: 404 };
//         }
//         const orders = await Order.find({ customerId: customer._id });
//         const orderDetails = [];
//         for (let order of orders) {
//             const orderItems = await OrderItem.find({ orderId: order._id }).populate('productId');
//             orderDetails.push({
//                 totalAmount: order.totalAmount,
//                 givenAmount: order.givenAmount,
//                 refundAmount: order.refundAmount,
//                 orderDate: order.orderDate,
//                 items: orderItems.map(item => ({
//                     productName: item.productId.name,
//                     quantity: item.quantity,
//                     price: item.price,
//                     subTotal: item.subTotal
//                 }))
//             });
//         }
//         return {
//             customer: {
//                 fullName: customer.fullName,
//                 phoneNumber: customer.phoneNumber,
//                 address: customer.address
//             },
//             orders: orderDetails
//         };
//     } catch (error) {
//         console.error(error);
//         return { error: 'Có lỗi xảy ra khi lấy thông tin khách hàng và lịch sử mua hàng', status: 500 };
//     }
// };