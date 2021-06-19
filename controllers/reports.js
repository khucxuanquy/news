const Reports = require('../models/reports')
const report = new Reports()
const { resFail, resSuccess, randomId } = require('../helpers')

module.exports = {
    async create(req, res) {
        req.body.id = randomId()
        req.body.user_id = req.token.id
        let { error } = await report.create(req.body)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },

    async delete(req, res) {
        const { id } = req.query
        let { error } = await report.delete(id)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())
    },

    async getReports(req, res) {
        let { error, data } = await report.getReports(req.token)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
}
