const baseModel = require('../baseModels/baseModel')
const { convertDateTimeline } = require('../helpers')
class Messages extends baseModel {
    constructor() {
        super('messages')
        this.id = ''
        this.sender_id = ''
        this.receive_id = ''
        this.content = ''
        this.image = ''
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.sender_id) this.sender_id = String(dataInput.sender_id)
        if (dataInput.receive_id) this.receive_id = String(dataInput.receive_id)
        if (dataInput.content) this.content = String(dataInput.content)
        if (dataInput.image) this.image = String(dataInput.image)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.sender_id = this.sender_id
        data.receive_id = this.receive_id
        data.content = this.content
        data.image = this.image
        data.dateCreated = this.dateCreated
        return data
    }

    async getMessage({ sender_id, receive_id, from, limit }) {
        from = from || 0;
        if (limit && limit > 30) limit = 30
        limit = limit || 15
        if (!sender_id || !receive_id) return { error: 'Thiếu trường sender_id hoặc receive_id' };
        // lepwxqbc0u4049ce5731285
        // u0daxxx0t0gimuxgytvlij
        // SELECT * FROM messages WHERE (receive_id='lepwxqbc0u4049ce5731285' OR receive_id='u0daxxx0t0gimuxgytvlij') AND (sender_id='lepwxqbc0u4049ce5731285' OR sender_id='u0daxxx0t0gimuxgytvlij')
        let query = `SELECT * FROM messages WHERE (receive_id='${sender_id}' OR receive_id='${receive_id}') AND (sender_id='${sender_id}' OR sender_id='${receive_id}') `
        query += `ORDER BY dateCreated DESC limit ${from},${limit}`
        return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data: data.map(i => ({ ...i, dateCreated: i.dateCreated })) }))
        })
    }
}

module.exports = Messages