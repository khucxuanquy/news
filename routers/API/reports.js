const express = require('express');
const reports = require('../../controllers/reports');
const router = express.Router();
const { verifyToken } = require('../../helpers')

router.post('/create', reports.create)
router.delete('/delete', verifyToken, reports.delete)
router.get('/getReports', verifyToken, reports.getReports)

module.exports = router