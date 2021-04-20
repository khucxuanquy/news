const baseModel = require('../baseModels/baseModel')

class Users extends baseModel {
    constructor() {
        super('accounts')
        this.id = ''
        this.username = ''
        this.fullName = ''
        this.password = ''
        this.avatar = ''
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.username) this.username = String(dataInput.username)
        if (dataInput.fullName) this.fullName = String(dataInput.fullName)
        if (dataInput.password) this.password = String(dataInput.password)
        if (dataInput.manager_id) this.manager_id = String(dataInput.manager_id)
        if (dataInput.permission) this.permission = Number(dataInput.permission)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.username = this.username
        data.fullName = this.fullName
        data.password = this.password
        data.manager_id = this.manager_id
        data.permission = this.permission
        data.dateCreated = this.dateCreated
        return data
    }

}

module.exports = Users