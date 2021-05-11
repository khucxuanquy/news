const Users = require('../models/users')
const FIELDS = ['id', 'fullName', 'manager_id', 'permission', 'username', 'dateCreated'].join()
const { signToken, resFail, resSuccess, randomId, sendToEmailToVerifyAccount, decodeToken, FIFTEEN_MINUTES, hashPassword, checkTypeEmail, sendToEmailToChangePassword, ONE_DAY } = require('../helpers')
const { l } = require('../config')
const user = new Users()

module.exports = {
    async create(req, res) {
        const { username } = req.body;
        // check exist
        const { error: errGetUser, data: dataGetUser } = await user.get({ fields: ['id'], conditions: { username } });
        if (errGetUser) return res.send(resFail({ error: errGetUser }));
        if (dataGetUser.length) return res.send(resFail({ message: 'Tài khoản đã tồn tại' }));

        // let's create user
        req.body.password = hashPassword(req.body.password)
        const { error, data } = await user.create(req.body);
        if (error) return res.send(resFail({ error }));
        res.send(resSuccess({ data }));
    },

    async edit(req, res) {
        if (req.body.password) req.body.password = hashPassword(req.body.password)
        let { error } = await user.edit(req.body)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())
    },

    async delete(req, res) {
        let { id } = req.query
        let { error } = await user.delete(id)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())
    },

    async login(req, res) {
        const { username, password, admin } = req.body
        // get all user with conditions username, password
        let { error, data } = await user.get({ fields: ['id', 'permission', 'position'], conditions: { username, password: hashPassword(password) } })
        if (error) return res.send(resFail({ error }))
        if (!data.length) return res.send('Tài khoản không tồn tại') // note: logout
        // encode token
        const { id, permission, position } = data[0]
        if (admin && position === 'reader') return res.send(resFail({ message: 'Bạn không có quyền truy cập' }))
        const token = signToken({ id, permission })
        res.send(resSuccess({ token, message: 'Đăng nhập thành công' }))
    },

    async getInfoUser(req, res) {
        const { id, iat } = req.token
        const { location } = req.query
        let { error, data } = await user.get({ fields: ['id', 'fullName', 'permission', 'position', 'manager_id'], conditions: { id } })
        if (error) return res.send(resFail({ error }))
        if (!data.length) return res.send(resFail({ message: 'logout now' })) // note: logout
        if (location && data[0].position == 'reader') return res.send(resFail())
        res.send(resSuccess({ data: data[0] }))
    },

    async logout(req, res) {
        res.send(resSuccess())
    },

    async getUsersByPermission(req, res) {
        const { id: manager_id, permission, iat } = req.token
        let { error, data } = await user.getUsersByPermission({ FIELDS, permission, manager_id })
        if (error) return res.send(resFail({ error }))
        data = data.filter(i => i.id != manager_id)
        res.send(resSuccess({ data }))
    },

    async register(req, res) {
        const { email, fullName, password, rePassword } = req.body
        if (!checkTypeEmail(email)) return res.send(resFail({ message: 'Email không hợp lệ' }))
        if (password !== rePassword) return res.send(resFail({ message: 'Mật khẩu phải giống nhau' }))

        let { error, data } = await user.get({ fields: ['id'], conditions: { username: email } })
        if (error) return res.send(resFail({ error }))
        if (data.length) return res.send({ message: 'Tài khoản Đã tồn tại' })

        let token = signToken({ email, fullName, password })
        sendToEmailToVerifyAccount({ email, token })
            .then(response => console.log(111, response))
            .catch(err => l.error(err))
        res.send(resSuccess({ message: 'Chúng tôi đã gửi thư xác nhận đến email mà bạn đăng kí' }))
    },

    async verify(req, res) {
        const { token } = req.query
        if (!token) return res.send(resFail({ message: 'Token không hợp lệ' }))
        let body = decodeToken(token) // body: { email, password, fullName }
        if (!body || (body && !body.email)) return res.send(resFail({ message: 'Token không hợp lệ' }));
        if (+new Date() - body.iat * 1000 > FIFTEEN_MINUTES) return res.send(resFail({ message: 'Token đã hết hạn' }));
        const { error: errorCheck, data: dataCheck } = await user.get({ fields: ['id'], conditions: { username: body.email } })
        if (errorCheck) return res.send(resFail({ error: errorCheck }))
        if (dataCheck.length) return res.send('Tài khoản Đã tồn tại')
        let obj = {
            username: body.email,
            password: hashPassword(body.password),
            fullName: body.fullName,
            position: 'reader',
        }
        const { error, data } = await user.create(obj);
        if (error) return res.send(resFail({ error }));
        res.send(`Xác Thực thành công, <a href='http://localhost:8080/home/login'>Bấm vào đây để đăng nhập</a>`);
        // res.redirect('')
    },

    async forgotPassword(req, res) {
        const { email } = req.body
        if (!checkTypeEmail(email)) return res.send(resFail({ message: 'Email không hợp lệ' }))
        let { error, data } = await user.get({ fields: ['id'], conditions: { username: email } })
        if (error) return res.send(resFail({ message: error }))
        if (!data.length) return res.send(resFail({ message: 'Không tìm thấy tài khoản' }))

        // token la id user
        let token = signToken({ id: data[0].id })
        sendToEmailToChangePassword({ email, token }).then(r => { }).catch(e => { })
        res.send(resSuccess({ message: 'Chúng tôi đã gửi thư xác nhận đến email mà bạn đăng kí, vui lòng đăng nhập vào email để reset lại mật khẩu' }))
    },

    async verifyForgotPassword(req, res) {
        let token = decodeToken(req.query.token)
        if (!token) return res.send(resFail({ code: 1, message: 'sai token' }))
        if (+new Date() - token.iat * 1000 > ONE_DAY) return res.send(resFail({ code: 2, message: 'Đã hết hạn đổi mật khẩu' }))
        res.send(resSuccess())
    },

    async changePassword(req, res) {
        let { password, rePassword, token } = req.body
        token = decodeToken(token)

        // check password or expire token
        if (password !== rePassword) return res.send(resFail({ message: 'mật khẩu không giống nhau' }))
        if (+new Date() - token.iat * 1000 > ONE_DAY) return res.send(resFail({ message: 'Đã hết hạn đổi mật khẩu' }))

        password = hashPassword(password)
        let { error } = await user.edit({ password, id: token.id })
        if (error) return res.send(resFail({ message: error }))
        res.send(resSuccess({ message: 'Đổi mật khẩu thành công' }))
    },

    // realtime
    async getUsersInMessenger(dataInput) {
        let { error, data } = await user.getUsersInMessenger(dataInput)
        if (error) return { error };
        return { data }
    }
}