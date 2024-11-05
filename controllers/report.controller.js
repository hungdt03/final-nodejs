const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const { startOfDay, startOfWeek, startOfMonth, endOfDay, subDays } = require('date-fns');
const { formatDateTime } = require("../utils/formatDatetime");
const { formatCurrencyVND } = require("../utils/formatCurrency");

const types = ['today', 'yesterday', 'month', 'week'];

exports.report = async (req, res) => {
    const { type = '', from, end } = req.query;
    let dateFilter = {};

    if (types.includes(type)) {
        const now = new Date();

        if (type === 'today') {
            dateFilter = {
                orderDate: { $gte: startOfDay(now), $lte: endOfDay(now) }
            };
        } else if (type === 'yesterday') {
            const yesterday = subDays(now, 1);
            dateFilter = {
                orderDate: { $gte: startOfDay(yesterday), $lte: endOfDay(yesterday) }
            };
        } else if (type === 'week') {
            const sevenDaysAgo = subDays(now, 7);
            dateFilter = {
                orderDate: { $gte: sevenDaysAgo, $lte: endOfDay(now) }
            };
        } else if (type === 'month') {
            dateFilter = {
                orderDate: { $gte: startOfMonth(now), $lte: endOfDay(now) }
            };
        }
    } else if (from && end) {
        dateFilter = {
            orderDate: { $gte: startOfDay(new Date(from)), $lte: endOfDay(new Date(end)) }
        };
    }

    const orders = await Order.find(dateFilter).sort({ orderDate: -1 }).populate('customerId');;
    const orderIds = orders.map(order => order._id);

    const orderItems = await OrderItem.find({ orderId: { $in: orderIds } }).populate('productId');

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = orders.length;
    const productCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalProfit = orderItems.reduce((prev, curr) => (curr.price - curr.purchasePrice) * curr.quantity, 0)

    const filterOrders = orders.map(o => ({
        id: o._id,
        orderDate: formatDateTime(o.orderDate),
        totalAmount: formatCurrencyVND(o.totalAmount),
        customer:{
            id: o.customerId._id,   
            fullName: o.customerId.fullName, 
            address: o.customerId.address 
        } 
    }))


    res.render('report', {
        title: 'Báo Cáo Doanh Thu',
        totalAmount: formatCurrencyVND(totalAmount),
        orderCount,
        productCount,
        orders: filterOrders,
        totalProfit: formatCurrencyVND(totalProfit),
        type,
        from,
        end
    });
};