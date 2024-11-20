const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const userApi = require('../apis/user.api');
const { uploadAvatar } = require('../utils/multer-upload');


router.get('/', userController.accountsPage);
router.get('/details/:userId', userController.accountDetail);
router.get('/profile', userController.profilePage);
router.get('/login', userController.loginWithLink);

router.post('/upload-avatar', (req, res, next) => {
    uploadAvatar.single('avatar')(req, res, (err) => {
        if (err) {
            req.toastr.error(err.message || 'Có lỗi xảy ra')
            return res.redirect('/profile')
        }
        next();
    });
}, userController.uploadAvatar);

router.post('/toggle-locked/:id', userController.toggleLocked);
router.post('/change-password', userController.changePassword);
router.post('/change-info', userController.changeInfo);
router.post('/send-link-again/:id', userController.resendLink);

// API
router.post('/api', userApi.createAccount);

module.exports = router;