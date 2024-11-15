const Customer = require("../models/customer.model");


exports.findCustomer = async (req, res) => {
    const { phoneNumber } = req.params;
    
    try {   
        let customer = await Customer.findOne({ phoneNumber });
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
