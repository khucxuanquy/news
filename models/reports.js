const baseModel = require('../baseModels/baseModel')

class Statistics extends baseModel {
    constructor() {
        super('statistics')
        this.id = ''
        this.post_id = ''
        this.view = 0
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.post_id) this.post_id = String(dataInput.post_id)
        if (dataInput.view) this.view = Number(dataInput.view)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.post_id = this.post_id
        data.view = this.view
        data.dateCreated = this.dateCreated
        return data
    }
}

module.exports = Statistics