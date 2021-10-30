const baseModel = require('../baseModels/baseModel')
const { convertDateTimeline } = require('../helpers')
class Users extends baseModel {
    constructor() {
        super('users')
        this.id = ''
        this.username = ''
        this.fullName = ''
        this.password = ''
        this.manager_id = '' // default admin
        this.avatar = 'https://doan.khucblog.com/static/images/avatar-default.jpg'
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

    async getUsersInMessenger(dataInput) {
        let { id, permission, manager_id } = dataInput
        if (!id || !permission || !manager_id) return { error: 'Thiếu trường id, permission hoặc manager_id' };
        // thieu manager_id

        let query = `SELECT id, avatar, fullName FROM users WHERE NOT position = 'reader' `;

        // *) admin : ORDER BY permission 
        // *) manager : permission =3, manager_id = id,
        // *) staff: permission = 2, id == manager_id, 
        if (permission === 2) query += `AND permission = 3 OR manager_id='${id}' `;
        if (permission === 1) query += `AND permission = 3 OR id='${manager_id}' `;
        query += 'ORDER BY permission DESC'
        return await new Promise(resolve => {
            this.sql.query(query, (error, dataUsers) => {
                // build query
                let buildQuery = idFriend => `SELECT content, dateCreated, sender_id FROM messages WHERE (receive_id = '${idFriend}' AND sender_id = '${id}') OR (receive_id = '${id}' AND sender_id = '${idFriend}') ORDER BY dateCreated DESC LIMIT 0,1`;
                // loop each latest messages
                Promise.all(dataUsers.map(user => new Promise(r => {
                    this.sql.query(buildQuery(user.id), (e, d) => {
                        if(e) return r({ content: 'có lỗi xảy ra khi lấy tin nhắn' })
                        if(!d.length) return r({ content: 'Hãy gửi một lời chào đầu tiên của bạn' })
                        r({ content: d[0].sender_id === id ? ('Bạn: :' + d[0].content) : d[0].content, dateCreated: d[0].dateCreated })
                    })
                })))
                .then(Messages => {
                    let data = dataUsers.map((user, index) => ({...user, ...Messages[index] }))
                    resolve({ error, data })
                })
                .catch(error => resolve({ error, data: [] }))
            })
        })
    }
        
    async getListStaff({ id, permission }) {
        if(!permission || permission == 1) return { data: [] }
        let query = `SELECT id, avatar, fullName, username FROM users WHERE NOT position = 'reader'`
        if(permission == 2) query += ` AND manager_id = '${id}'`
        return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data }))
        })
    }
    async handleAfterEditUser(id, newPermission) {
        let query = `UPDATE users `
        // từ 1 đi lên hoặc chức mới lên lv2, lv3 => bỏ manager_id
        if(newPermission === 3 || newPermission === 2) query += `SET manager_id = '' WHERE id = '${ id }'`
        else if(newPermission === 1) query += `SET manager_id = '' WHERE manager_id = '${ id }'`
        return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data }))
        })
    }

    async transferUser({ manager_id, idsUserTransferred }) {
        let query = `UPDATE users SET manager_id = '${ manager_id }' WHERE`
        if (idsUserTransferred.length === 1) query += ` id = '${idsUserTransferred[0]}'`
        else if (idsUserTransferred.length > 1) query += ` id IN ('${idsUserTransferred.join(`', '`)}')` 
        return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data }))
        })
    }
}

module.exports = Users