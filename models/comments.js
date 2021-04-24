const baseModel = require('../baseModels/baseModel')

class Comments extends baseModel {
    constructor() {
        super('comments')
        this.id = ''
        this.post_id = ''
        this.user_id = ''
        this.content = ''
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.post_id) this.post_id = String(dataInput.post_id)
        if (dataInput.user_id) this.user_id = String(dataInput.user_id)
        if (dataInput.content) this.content = String(dataInput.content)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.post_id = this.post_id
        data.user_id = this.user_id
        data.content = this.content
        data.dateCreated = this.dateCreated
        return data
    }

}

module.exports = Comments