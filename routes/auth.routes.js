const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.get('/change-password', authController.changePassword);
router.get('/login', authController.loginPage);
router.post('/login', authController.processLogin);
router.post('/logout', authController.logout);

module.exports = router;