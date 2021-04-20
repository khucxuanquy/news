const express = require('express');
const router = express.Router();
const category = require('../../controllers/categories')
const { verifyToken } = require('../../helpers')

router.get('/getAllCategories', category.getAllCategories)
router.get('/getCategoriesInDashboard', category.getCategoriesInDashboard)
router.post('/create', verifyToken, category.create)
router.put('/edit', verifyToken, category.edit)
router.delete('/delete', verifyToken, category.delete)

module.exports = router