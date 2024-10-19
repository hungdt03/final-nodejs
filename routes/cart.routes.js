const express = require('express');
const router = express.Router();
const cartApi = require('../apis/cart.api');

// API
router.post('/api/add', cartApi.addToCart);
router.post('/api/update', cartApi.updateCart);
router.delete('/api/:productId', cartApi.removeItemCart);
router.get('/api/', cartApi.getCartSession);

module.exports = router;