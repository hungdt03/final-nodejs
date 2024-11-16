const multer = require('multer');
const path = require('path');

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const imageFileFilter = (req, file, cb) => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP).'), false); 
    }
};

const storageProduct = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/product');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const storageAvatar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatar');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadProduct = multer({ storage: storageProduct, fileFilter: imageFileFilter });
const uploadAvatar = multer({ storage: storageAvatar, fileFilter: imageFileFilter });

module.exports = { uploadProduct , uploadAvatar  }