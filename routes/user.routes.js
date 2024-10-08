const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get('/', userController.accountsPage);
router.post('/create', userController.createAccount);
router.get('/profile', userController.profilePage);

module.exports = router;