const express = require('express');
const router = express.Router();
const comments = require('../../controllers/comments')
const { verifyToken } = require('../../helpers')

router.get('/getComments', comments.getComments)
router.post('/create', verifyToken, comments.create)
router.put('/edit', verifyToken, comments.edit)
router.put('/changeReaction', verifyToken, comments.changeReaction)
router.delete('/delete', verifyToken, comments.delete)

module.exports = router