const Customer = require("../models/customer.model");


exports.findCustomer = async (req, res) => {
    const { phoneNumber } = req.params;
    console.log(phoneNumber)
    
    try {   
        let customer = await Customer.findOne({ phoneNumber });
        console.log(customer)
        if(!customer) {
            return res.status(404).json({
                success: false,
                message: 'Khách hàng chưa tồn tại'
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
            message: 'Tìm thấy thông tin khách hàng'
        });
    } catch(error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Lỗi xử lý thông tin khách hàng'
        });
    }
};
exports.getCustomerOrder = async (req, res) => {
    try {
        const { phoneNumber } = req.query;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy thông tin khách hàng và lịch sử mua hàng'
        });
    }
};