const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.get('/change-password', authController.changePassword);
router.get('/login', authController.login);

module.exports = router;