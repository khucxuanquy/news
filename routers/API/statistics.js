const express = require('express');
const statistics = require('../../controllers/statistics');
const router = express.Router();
const { verifyToken } = require('../../helpers')

router.post('/create', statistics.create)
router.delete('/delete', verifyToken, statistics.delete)
router.get('/getStatistics', verifyToken, statistics.getStatistics)

module.exports = router