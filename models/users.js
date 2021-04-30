const baseModel = require('../baseModels/baseModel')

class Users extends baseModel {
    constructor() {
        super('users')
        this.id = ''
        this.username = ''
        this.fullName = ''
        this.password = ''
        this.manager_id = '' // default admin
        this.avatar = ''
        this.permission = 1
        this.position = '' // admin, manager, staff and reader
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.username) this.username = String(dataInput.username)
        if (dataInput.fullName) this.fullName = String(dataInput.fullName)
        if (dataInput.password) this.password = String(dataInput.password)
        if (dataInput.avatar) this.avatar = String(dataInput.avatar)
        if (dataInput.manager_id) this.manager_id = String(dataInput.manager_id)
        if (dataInput.position) this.position = String(dataInput.position)
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
        data.avatar = this.avatar
        data.permission = this.permission
        data.position = this.position
        data.dateCreated = this.dateCreated
        return data
    }

    async getUsersByPermission(dataInput) {
        const permission = dataInput.permission || 1
        const { FIELDS, manager_id } = dataInput

        let q = `SELECT ${FIELDS} FROM users `
        if (permission == 3) q += "where permission <= 3 AND NOT position='reader'"
        else if (permission == 2) q += `where permission < 2 AND manager_id='${manager_id}' AND NOT position='reader'`
        q += " ORDER BY permission DESC"
        return await new Promise(resolve => {
            this.sql.query(q, (error, data) => resolve({ error, data }))
        })
    }
}

module.exports = Users