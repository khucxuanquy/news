const baseModel = require('../baseModels/baseModel')
const PARENT = ['comments.id', 'reaction', 'content', 'amount_child_comment', 'comments.dateCreated', 'fullName', 'avatar'].join()
const CHILDREN = ['comments.id', 'reaction', 'content', 'reply_id_comment', 'comments.dateCreated', 'fullName', 'avatar'].join()
class Comments extends baseModel {
    constructor() {
        super('comments')
        this.id = ''
        this.post_id = ''
        this.user_id = ''
        this.content = ''
        this.reaction = 0 // like
        this.position = 0 // 0: parent, 1: child
        this.reply_id_comment = ''
        this.amount_child_comment = 0
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.post_id) this.post_id = String(dataInput.post_id)
        if (dataInput.user_id) this.user_id = String(dataInput.user_id)
        if (dataInput.content) this.content = String(dataInput.content)
        if (dataInput.reaction) this.reaction = Number(dataInput.reaction)
        if (dataInput.position) this.position = Number(dataInput.position)
        if (dataInput.reply_id_comment) this.reply_id_comment = String(dataInput.reply_id_comment)
        if (dataInput.amount_child_comment) this.amount_child_comment = Number(dataInput.amount_child_comment)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.post_id = this.post_id
        data.user_id = this.user_id
        data.content = this.content
        data.reaction = this.reaction
        data.position = this.position
        data.reply_id_comment = this.reply_id_comment
        data.amount_child_comment = this.amount_child_comment
        data.dateCreated = this.dateCreated
        return data
    }

    async deleteCommentOwner(dataInput) {
        let { id, user_id } = dataInput
        if (!id || !user_id) return { error: 'Not found id' }
        return await new Promise(resolve => {
            this.sql.query(`DELETE FROM ${this.table} WHERE id='${id}' AND user_id='${user_id}'`, (error, data) => resolve({ error, data }))
        })
    }

    async getComments({ post_id, limit, from, reply_id_comment }) {
        let query = `SELECT ${reply_id_comment ? CHILDREN : PARENT} FROM comments INNER JOIN users ON users.id = comments.user_id WHERE post_id = '${post_id}'`

        // check position parent || child
        if (reply_id_comment) query += ` AND reply_id_comment='${reply_id_comment}'`;
        else query += ` AND comments.position = 0`;

        query += ` ORDER BY dateCreated DESC limit ${from},${limit}`
        return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data }))
        })
    }

    async getCommentsByIdUser({ id, limit, from }) {
        let query = `SELECT posts.title, posts.image, posts.category_id, comments.id as 'comment_id', comments.reaction, comments.content, comments.dateCreated FROM comments INNER JOIN posts ON posts.id = comments.post_id WHERE comments.user_id = '${id}' AND posts.activated = 'true' ORDER BY dateCreated DESC limit ${from},${limit}`
         return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data }))
         })
    }

}

module.exports = Comments