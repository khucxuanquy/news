const baseModel = require('../baseModels/baseModel')

class Messages extends baseModel {
    constructor() {
        super('messages')
        this.id = ''
        this.sender_id = ''
        this.receive_id = ''
        this.content = ''
        this.images = ''
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.sender_id) this.sender_id = String(dataInput.sender_id)
        if (dataInput.receive_id) this.receive_id = String(dataInput.receive_id)
        if (dataInput.content) this.content = String(dataInput.content)
        if (dataInput.images) this.images = String(dataInput.images)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.sender_id = this.sender_id
        data.receive_id = this.receive_id
        data.content = this.content
        data.images = this.images
        data.dateCreated = this.dateCreated
        return data
    }

}

module.exports = Messages