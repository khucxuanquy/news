const Users = require('../models/users')
const FIELDS = ['id', 'fullName', 'manager_id', 'permission', 'username', 'dateCreated'].join()
const { signToken, resFail, resSuccess, randomId } = require('../helpers')
const user = new Users()

module.exports = {
    async create(req, res) {
        const { username } = req.body;
        // check exist
        const { error: errGetUser, data: dataGetUser } = await user.get({ fields: ['id'], conditions: { username } });
        if (errGetUser) return res.send(resFail({ error: errGetUser }));
        if (dataGetUser.length) return res.send(resFail({ message: 'Tài khoản đã tồn tại' }));

        // let's create user
        req.body.id = randomId();
        const { error, data } = await user.create(req.body);
        if (errGetUser) return res.send(resFail({ error }));
        res.send(resSuccess({ data }));
    },

    async edit(req, res) {
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
        const { username, password } = req.body
        // get all user with conditions username, password
        let { error, data } = await user.get({ fields: ['id', 'permission'], conditions: { username, password } })
        if (error) return res.send(resFail({ error }))
        if (!data.length) return res.send('Tài khoản không tồn tại') // note: logout
        // encode token
        const { id, permission } = data[0]
        const token = signToken({ id, permission })
        res.send(resSuccess({ token, message: 'Đăng nhập thành công' }))
    },

    async getInfoUser(req, res) {
        let { id, iat } = req.token
        let { error, data } = await user.get({ fields: ['id', 'fullName', 'manager_id', 'permission'], conditions: { id } })
        if (error) return res.send(resFail({ error }))
        if (!data.length) return res.send(resFail({ message: 'logout now' })) // note: logout
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
    }
}