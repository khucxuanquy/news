const express = require('express');
const router = express.Router();
const post = require('../../controllers/posts')
const { verifyToken } = require('../../helpers')

router.post('/create', verifyToken, post.create)
router.put('/edit', verifyToken, post.edit)
router.delete('/delete', verifyToken, post.delete)
router.get('/getPostsByPermission', verifyToken, post.getPostsByPermission)
router.get('/searchByPermission', verifyToken, post.searchByPermission)

router.get('/search', post.search)
router.get('/get', post.get)
router.get('/getContent', post.getContent)
router.get('/getPostsByCategory', post.getPostsByCategory)
router.get('/home', post.home)

module.exports = router
