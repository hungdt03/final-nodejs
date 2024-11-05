const express = require('express')
const router = express.Router();

const orderController = require('../controllers/order.controller')

router.get('/checkout', orderController.checkout)
router.get('/invoice/:orderId', orderController.viewInvoice)
router.get('/:orderId', orderController.orderDetail)
router.get('/success/:orderId', orderController.orderSuccess)
router.post('/checkout', orderController.processCheckout)

module.exports = router;