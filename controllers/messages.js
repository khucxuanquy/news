const Messages = require('../models/messages')
const message = new Messages()
const { resFail, resSuccess, randomId } = require('../helpers')
// realtime system

module.exports = {
    async create(dataInput) {
        return await message.create(dataInput)
    },
    async edit(dataInput) {
        return await message.edit(dataInput)
    },
    async delete(id) {
        return await message.delete(id)
    },
    async getMessage(dataInput) {
        return await message.getMessage(dataInput)
    },
}