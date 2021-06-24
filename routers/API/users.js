const express = require('express');
const user = require('../../controllers/users');
const router = express.Router();
const { verifyToken } = require('../../helpers')

router.post('/create', verifyToken, user.create)
router.put('/edit', verifyToken, user.edit)
router.delete('/delete', verifyToken, user.delete)
router.get('/getInfoUser', verifyToken, user.getInfoUser)
router.get('/getUsersByPermission', verifyToken, user.getUsersByPermission)
router.put('/changeUserInfo', verifyToken, user.changeUserInfo)

router.get('/verify', user.verify)
router.get('/verifyForgotPassword', user.verifyForgotPassword)
router.post('/changePassword', user.changePassword)
router.post('/forgotPassword', user.forgotPassword)
router.post('/register', user.register)
router.post('/login', user.login)
router.post('/logout', user.logout)
module.exports = router