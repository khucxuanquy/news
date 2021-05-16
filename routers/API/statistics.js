const express = require('express');
const statistics = require('../../controllers/statistics');
const router = express.Router();
const { verifyToken } = require('../../helpers')

router.delete('/delete', verifyToken, statistics.delete)
router.get('/getStatistics', verifyToken, statistics.getStatistics)
router.get('/getByDatePicker', verifyToken, statistics.getByDatePicker)
router.get('/statisticCategories', verifyToken, statistics.statisticCategories)
module.exports = router