const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller')
const categoyApi = require('../apis/category.api')

router.get('/', categoryController.showCategory);

// API
router.get('/api', categoyApi.getAll);
router.get('/api/search', categoyApi.search);
router.get('/api/:id', categoyApi.getId);
router.post('/api', categoyApi.create);
router.put('/api/:id', categoyApi.update);
router.delete('/api/:id', categoyApi.deleteCategory);

module.exports = router;