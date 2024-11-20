const Customer = require('../models/customer.model');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const { formatCurrencyVND } = require('../utils/formatCurrency');
const { formatDateTime } = require('../utils/formatDatetime');

exports.getCustomers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 5;
    const search = req.query.search || '';
    try {
        const filter = search
            ? {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { phoneNumber: { $regex: search, $options: "i" } },
                ],
            }
            : {};
            
        const customers = await Customer.find(filter).skip((page - 1) * size).limit(size);
        const total = await Customer.countDocuments(filter);
        const plainCustomers = customers.map(customer => customer.toObject())
        res.render('customer', {
            customers: plainCustomers, isEmpty: customers.length === 0,
            pagination: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size)
            },
            query: { search },
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.render('500')
    }
};

exports.customerDetail = async (req, res) => {
    const { customerId } = req.params;

    try {
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
    } catch (err) {
        console.error('Error fetching customer detail:', err);
        res.render('500')
    }

}

