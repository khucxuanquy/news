const Messages = require('../models/messages')
const message = new Messages()
const { resFail, resSuccess, randomId } = require('../helpers')

// realtime system

module.exports = {
    async create(req) {
        req.body.id = randomId()
        let { error, data } = await message.create(req.body)
        if (error) return resFail({ error })
        return resSuccess({ data })

    },
    async edit(req) {
        let { error } = await message.edit(req.body)
        if (error) return resFail({ error })
        return resSuccess()
    },
    async delete(req) {
        const { id } = req.body
        let { error } = await message.delete(id)
        if (error) return resFail({ error })
        return resSuccess()

    },
    // async getAllCategories(req) {
    //     let { error, data } = await message.getAllCategories()
    //     if (error) return resFail({ error })
    //     return resSuccess({ data: data })
    // },
}