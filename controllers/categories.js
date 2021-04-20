const Categories = require('../models/categories')
const category = new Categories()
const { resFail, resSuccess, accentedLetters, randomId } = require('../helpers')
let youAreNotAdmin = () => ({ message: 'Tài khoản của bạn không phải là admin' })

module.exports = {
    async create(req, res) {
        const { permission } = req.token
        if (permission < 3) return res.send(youAreNotAdmin())

        req.body.id = randomId()
        req.body.url = accentedLetters(req.body.name)
        let { error, data } = await category.create(req.body)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))

    },
    async edit(req, res) {
        const { permission } = req.token
        if (permission < 3) return res.send(youAreNotAdmin())

        req.body.url = accentedLetters(req.body.name)
        let { error } = await category.edit(req.body)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },
    async delete(req, res) {
        const { permission } = req.token
        const { id } = req.query
        if (permission < 3) return res.send(youAreNotAdmin())
        let { error } = await category.delete(id)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },
    async getCategoriesInDashboard(req, res) {
        let { error, data } = await category.get({ fields: ['id', 'color', 'name', 'url'] })
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))

    },
    async getAllCategories(req, res) {
        let { error, data } = await category.getAllCategories()
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data: data }))
        
    },
}