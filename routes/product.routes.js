const express = require('express');
const router = express.Router();
const multer = require('multer');

const productController = require('../controllers/product.controller');
const productApi = require('../apis/product.api');
const { storageProduct } = require('../utils/multer-upload');

const upload = multer({ storage: storageProduct });

router.get('/', productController.showProducts);

// API
router.get('/api/search', productApi.search);
router.get('/api/:id', productApi.getId);
router.post('/api', upload.single('thumbnail'), productApi.create);
router.put('/api/:id', upload.single('thumbnail'), productApi.update);
router.delete('/api/:id', productApi.deleteProduct);

module.exports = router;