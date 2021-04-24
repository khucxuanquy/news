const Comments = require('../models/comments')
const comment = new Comments()
const { resFail, resSuccess, accentedLetters, randomId } = require('../helpers')

module.exports = {
    async create(req, res) {
        req.body.id = randomId()
        let { error, data } = await comment.create(req.body)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))

    },
    async edit(req, res) {
        let content = req.body.content
        let { error } = await comment.edit({ content })
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },
    async delete(req, res) {
        const { id } = req.query
        let { error } = await comment.delete(id)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },
    async getComments(req, res) {
        // let { error, data } = await comment.get({ fields: ['id', 'color', 'name', 'url'] })
        // if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },

}