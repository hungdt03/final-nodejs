const express = require('express');
const router = express.Router();
const multer = require('multer');

const userController = require('../controllers/user.controller');
const userApi = require('../apis/user.api');
const { storageAvatar } = require('../utils/multer-upload');

const upload = multer({ storage: storageAvatar });

router.get('/', userController.accountsPage);
router.get('/:userId', userController.accountDetail);
router.get('/profile', userController.profilePage);
router.get('/login', userController.loginWithLink);
router.post('/upload-avatar', upload.single('avatar'), userController.uploadAvatar);
router.post('/toggle-locked/:id', userController.toggleLocked);
router.post('/change-password', userController.changePassword);
router.post('/change-info', userController.changeInfo);
router.post('/send-link-again/:id', userController.sendLinkAgain);

// API
router.post('/api', userApi.createAccount);

module.exports = router;