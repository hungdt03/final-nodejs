const express = require('express')
const router = express.Router();

const orderController = require('../controllers/order.controller')

router.get('/checkout', orderController.checkout)
router.post('/checkout', orderController.processCheckout)

module.exports = router;