const express = require('express');
const router = express.Router();
const comments = require('../../controllers/comments')

router.get('/getComments', comments.getComments)
router.post('/create', comments.create)
router.put('/edit', comments.edit)
router.delete('/delete', comments.delete)

module.exports = router