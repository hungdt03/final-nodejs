const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/product.controller');
const productApi = require('../apis/product.api');
const path = require('path');

// ktao multer -> upload anh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/product');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// dsach product
router.get('/', productController.showProducts);

// API
router.get('/api/:id', productApi.getId);
router.post('/api/add', upload.single('thumbnail'), productApi.create);
router.put('/api/edit/:id', upload.single('thumbnail'), productApi.update);
router.delete('/api/delete/:id', productApi.deleteProduct);

module.exports = router;