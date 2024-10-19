const Customer = require("../models/customer.model");
const Order = require("../models/order.model");

exports.checkout = (req, res) => {
    const carts = req.session.cart ?? []
    const totalPrice = carts.reduce((acc, curr) => acc + curr.subTotal, 0)
    res.render('checkout', { carts, totalPrice });
};


exports.processCheckout = async (req, res) => {
    const { fullName, phoneNumber, address, totalAmount, givenAmount, refundAmount } = req.body;
    const carts = req.session.cart ?? [];
    const totalPrice = carts.reduce((acc, curr) => acc + curr.subTotal, 0);

    if (!phoneNumber || !fullName || !address) {
        return res.render('checkout', { carts, totalPrice, error: 'Vui lòng cung cấp thông tin khách hàng' });
    }

    if (parseFloat(givenAmount) < parseFloat(totalAmount)) {
        return res.render('checkout', { carts, totalPrice, error: 'Số tiền khách đưa phải >= tổng hóa đơn' });
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
        await session.commitTransaction(); 
        session.endSession();

        req.session.cart = []
        req.toastr.success('Thanh toán đơn hàng thành công', "Thành công!");
        res.redirect("/");
    } catch (error) {
        await session.abortTransaction();
        session.endSession(); 

        console.error("Transaction error: ", error);
        return res.render('checkout', { carts, totalPrice, error: 'Có lỗi xảy ra khi lưu thông tin đơn hàng hoặc khách hàng.' });
    }
}