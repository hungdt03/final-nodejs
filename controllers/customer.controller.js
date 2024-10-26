const Customer = require('../models/customer.model');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const { formatCurrencyVND } = require('../utils/formatCurrency');
const { formatDateTime } = require('../utils/formatDatetime');

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        const plainCustomers = customers.map(customer => customer.toObject())
        console.log(plainCustomers);
        res.render('customer', { customers: plainCustomers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.customerDetail = async (req, res) => {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if(!customer) return res.redirect('/404')
    const orders = await Order.find({
        customerId
    })

    const filterOrders = orders.map(o => ({
        id: o._id,
        orderDate: formatDateTime(o.orderDate),
        totalAmount: formatCurrencyVND(o.totalAmount),
      
    }))

    res.render('customer-detail', {
        orders: filterOrders,
        customer
    })

}

exports.getCustomerOrder = async (phoneNumber) => {
    try {
        const customer = await Customer.findOne({ phoneNumber });
        if (!customer) {
            return { error: 'Không tìm thấy khách hàng', status: 404 };
        }
        // Tìm tat ca don hang cua cus
        const orders = await Order.find({ customerId: customer._id });
        const orderDetails = [];
        // duyet tat ca don hang
        for (let order of orders) {
            // Tìm all muc hang (order items) lq toi don hang
            const orderItems = await OrderItem.find({ orderId: order._id }).populate('productId');
            orderDetails.push({
                totalAmount: order.totalAmount,
                givenAmount: order.givenAmount,
                refundAmount: order.refundAmount,
                orderDate: order.orderDate,
                items: orderItems.map(item => ({
                    productName: item.productId.name,
                    quantity: item.quantity,
                    price: item.price,
                    subTotal: item.subTotal
                }))
            });
        }
        // tra ve danh sach
        return {
            customer: {
                fullName: customer.fullName,
                phoneNumber: customer.phoneNumber,
                address: customer.address
            },
            orders: orderDetails
        };
    } catch (error) {
        console.error(error);
        return { error: 'Có lỗi xảy ra khi lấy thông tin khách hàng và lịch sử mua hàng', status: 500 };
    }
};