const baseModel = require('../baseModels/baseModel')

class Reports extends baseModel {
    constructor() {
        super('reports')
        this.id = ''
        this.post_id = ''
        this.user_id = ''
        this.title = ''
        this.issue = ''
        this.content = ''
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.post_id) this.post_id = String(dataInput.post_id)
        if (dataInput.user_id) this.user_id = String(dataInput.user_id)
        if (dataInput.title) this.title = String(dataInput.title)
        if (dataInput.issue) this.issue = Number(dataInput.issue) || 3
        if (dataInput.content) this.content = String(dataInput.content)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.post_id = this.post_id
        data.user_id = this.user_id
        data.title = this.title
        data.issue = this.issue
        data.content = this.content
        data.dateCreated = this.dateCreated
        return data
    }
    async getReports(dataInput) {
        const { permission, id } = dataInput
        let q = `SELECT reports.id as id, reports.title, issue, reports.content, reports.dateCreated, posts.id as post_id, posts.title as post_title, users.username, users.fullName, users.avatar FROM reports INNER JOIN posts ON posts.id = reports.post_id INNER JOIN users ON reports.user_id = users.id `
        if (permission == 2) q += `WHERE posts.user_id IN (SELECT id from users WHERE id = '${id}' OR manager_id = '${id}') `
        q += " ORDER BY reports.dateCreated DESC"
        return await new Promise(resolve => {
            this.sql.query(q, (error, data) => resolve({ error, data }))
        })
    }

}
module.exports = Reports