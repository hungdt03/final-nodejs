const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const { startOfDay, startOfWeek, startOfMonth, endOfDay, subDays } = require('date-fns');
const { formatDateTime } = require("../utils/formatDatetime");
const { formatCurrencyVND } = require("../utils/formatCurrency");

const types = ['today', 'yesterday', 'month', 'week'];

const getDateFilter = (type, from, end) => {
    const now = new Date();

    if (type === 'today') {
        return { orderDate: { $gte: startOfDay(now), $lte: endOfDay(now) } };
    }
    if (type === 'yesterday') {
        const yesterday = subDays(now, 1);
        return { orderDate: { $gte: startOfDay(yesterday), $lte: endOfDay(yesterday) } };
    }
    if (type === 'week') {
        const sevenDaysAgo = subDays(now, 7);
        return { orderDate: { $gte: sevenDaysAgo, $lte: endOfDay(now) } };
    }
    if (type === 'month') {
        return { orderDate: { $gte: startOfMonth(now), $lte: endOfDay(now) } };
    }
    if (from && end) {
        return { orderDate: { $gte: startOfDay(new Date(from)), $lte: endOfDay(new Date(end)) } };
    }

    return {};
};

const calculateTotals = (orders, orderItems) => {
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalProfit = orderItems.reduce(
        (sum, item) => sum + (item.price - item.purchasePrice) * item.quantity,
        0
    );
    const productCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);

    const productSelling = orderItems.reduce((acc, item) => {
        const existingProduct = acc.find(product => product.productId.equals(item.productId._id));
        if (existingProduct) {
            existingProduct.quantity += item.quantity;
        } else {
            acc.push({
                productId: item.productId._id,
                productName: item.productId.name,
                quantity: item.quantity,
                thumbnail: item.productId.thumbnail,
            });
        }
        return acc;
    }, []);

    return { totalAmount, totalProfit, productCount, productSelling };
};

exports.report = async (req, res) => {
    const { type = '', from, end } = req.query;
    const page = parseInt(req.query.page) || 1;

    const dateFilter = getDateFilter(type, from, end);
    let limit = null;
    let totalPages = 0;
    let isShowPagination = false;

    if (!Object.keys(dateFilter).length) {
        const total = await Order.countDocuments();
        limit = 6;
        totalPages = Math.ceil(total / limit);
        isShowPagination = true;
    }

    const query = Order.find(dateFilter).sort({ orderDate: -1 }).populate('customerId');
    if (limit) query.skip((page - 1) * limit).limit(limit);

    const orders = await query;
    const orderIds = orders.map(order => order._id);

    const orderItems = await OrderItem.find({ orderId: { $in: orderIds } }).populate('productId');
    const { totalAmount, totalProfit, productCount, productSelling } = calculateTotals(orders, orderItems);

    const filterOrders = orders.map(o => ({
        id: o._id,
        orderDate: formatDateTime(o.orderDate),
        totalAmount: formatCurrencyVND(o.totalAmount),
        customer: {
            id: o.customerId._id,
            fullName: o.customerId.fullName,
            address: o.customerId.address,
        },
    }));

    res.render('report', {
        title: 'Báo Cáo Doanh Thu',
        totalAmount: formatCurrencyVND(totalAmount),
        orderCount: orders.length,
        productCount,
        orders: filterOrders,
        totalProfit: formatCurrencyVND(totalProfit),
        type,
        from,
        end,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        page,
        isShowPagination,
        isEmpty: filterOrders.length === 0,
        productSelling,
        isProductSellingEmpty: productSelling.length === 0,
    });
};