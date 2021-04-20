const baseModel = require('../baseModels/baseModel')

class Categories extends baseModel {
    constructor() {
        super('categories')
        this.id = ''
        this.name = ''
        this.url = ''
        this.color = ''
        this.dateCreated = ''
    }


    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.name) this.name = String(dataInput.name)
        if (dataInput.url) this.url = String(dataInput.url)
        if (dataInput.color) this.color = String(dataInput.color)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.name = this.name
        data.url = this.url
        data.color = this.color
        data.dateCreated = this.dateCreated
        return data
    }

    async getAllCategories() {
        return await new Promise(resolve => {
            this.sql.query('SELECT * FROM top_categories', (error, data) => resolve({ error, data }))
        })
    }
}

module.exports = Categories