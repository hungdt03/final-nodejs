const fs = require('fs');
const path = require('path');
const Customer = require('../models/customer.model');

exports.findOrCreateCustomer = async (req, res) => {
    const {phoneNumber, fullName, address} = req.body;
    // check phone -> ko có thì tạo mới -> có thì trả customer 
    try {   
        let customer = await Customer.findOne({ phoneNumber });
        if(!customer) {
            customer = new Customer({
                fullName,
                phoneNumber,
                address
            });
            await customer.save();
            return res.status(201).json({
                success: true,
                data: customer,
                message: 'Tạo khách hàng mới thành công'
            });
        }
        res.status(200).json({
            success: true,
            data: customer,
            message: 'Khách hàng đã tồn tại'
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi xử lý thông tin khách hàng'
        });
    }
};