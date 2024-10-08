const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/product.controller');
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
router.get('/', productController.getAll);
router.get('/:id', productController.getId);

router.get('/add', productController.showAddForm);
router.get('/edit/:id', productController.showEditForm);

router.post('/add', upload.single('thumbnail'), productController.create);

router.put('/edit/:id', upload.single('thumbnail'), productController.update);
router.delete('/delete/:id', productController.deleteProduct);
module.exports = router;