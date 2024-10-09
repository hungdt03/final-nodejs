const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const userApi = require('../apis/user.api');

router.get('/', userController.accountsPage);

router.get('/profile', userController.profilePage);
router.get('/login', userController.loginWithLink);

// API

router.post('/api', userApi.createAccount);

module.exports = router;