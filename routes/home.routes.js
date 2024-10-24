const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home.controller');

router.get('/', homeController.homePage);
// router.get('/customers', homeController.customer);
router.get('/profile', homeController.profile);
router.get('/report', homeController.report);
router.get('/invalid-token', homeController.invalidToken);

router.get('/change-password', homeController.changePassword);
router.post('/change-password', homeController.processChangePassword);
router.get('/login', homeController.loginPage);
router.post('/login', homeController.processLogin);
router.post('/logout', homeController.logout);

module.exports = router;