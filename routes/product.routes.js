const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const productApi = require('../apis/product.api');
const { uploadProduct } = require('../utils/multer-upload');

router.get('/', productController.showProducts);

// API
router.get('/api/search', productApi.search);
router.get('/api/:id', productApi.getId);
router.post(
    '/api',
    (req, res, next) => {
        uploadProduct.single('thumbnail')(req, res, (err) => {
            console.log(err)
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            next();
        });
    },
    productApi.create
);

router.put('/api/:id', (req, res, next) => {
    uploadProduct.single('thumbnail')(req, res, (err) => {
        console.log(err)
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, productApi.update);

router.delete('/api/:id', productApi.deleteProduct);

module.exports = router;