const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home.controller');

router.get('/', homeController.homePage);
router.get('/customers', homeController.customer);
router.get('/profile', homeController.profile);
router.get('/report', homeController.report);
router.get('/invalid-token', homeController.invalidToken);

module.exports = router;