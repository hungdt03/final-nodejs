const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');
const customerApi = require('../apis/customer.api')

router.get('/', customerController.getCustomers);
router.get('/:customerId', customerController.customerDetail);
router.get('/api/phone-number/:phoneNumber', customerApi.findCustomer);

module.exports = router;