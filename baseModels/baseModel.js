const { dbSql } = require('../config')
const { randomId } = require('../helpers')

class BaseModel {
    constructor(table) {
        this.sql = dbSql
        this.table = table;
    }
    /**
     * 
     * @param {Object} dataInput 
     */
    async create(dataInput) {
        // random _id
        dataInput.id = randomId()
        this.setter(dataInput)
        let fields = ''
        let val = ''
        for (const [field, value] of Object.entries(this.getter())) {
            fields += `\`${field}\`,`
            val += `'${String(value).replace(/\'/g, `\\'`).replace(/\"/g, `\\"`).replace(/\`/g, "\\`")}',`
        }
        fields = fields.slice(0, fields.length - 1)
        val = val.slice(0, val.length - 1)
        return await new Promise(resolve => {
            this.sql.query(`INSERT INTO ${this.table}(${fields}) VALUES(${val})`, error => resolve({ error, data: this.getter() }))
        })
    }
    /**
     * @param {Object} dataInput an Object includes "id" end another fields
     * @param dataInput.id - require
     */
    async edit(dataInput) {
        let set = ''
        for (const [field, value] of Object.entries(dataInput)) {
            if (String(field) in this && field !== 'id') set += `\`${field}\`='${String(value).replace(/\'/g, `\\'`).replace(/\"/g, `\\"`).replace(/\`/g, "\\`")}',`
        }
        set = set.slice(0, set.length - 1)
        return await new Promise(resolve => {
            this.sql.query(`UPDATE ${this.table} SET ${set} WHERE id='${dataInput.id}'`, (error, data) => resolve({ error, data }))
        })
    }
    /**
    * @param {String} id 
    */
    async delete(id) {
        if (!id) return { error: 'Not found id' }
        return await new Promise(resolve => {
            this.sql.query(`DELETE FROM ${this.table} WHERE id='${id}'`, (error, data) => resolve({ error, data }))
        })
    }
    /**
     * @param {object} dataInput
     * @param {String} dataInput.fields
     * @param {string} dataInput.from 
     * @param {string} dataInput.limit 
     * @param {string} dataInput.search 
     * @example
     * getAll({ fields: 'id,name', from: 0, limit: 15, search: '' })
     */
    async getAll(dataInput) {
        const { table } = this
        let { fields, from, limit, search } = dataInput
        // default
        if (!fields) fields = '*';
        let q = `SELECT ${fields} FROM ${table} `
        if (search) q += `WHERE title LIKE '%${search}%' OR description LIKE '%${search}%' `
        q += `ORDER BY dateCreated DESC limit ${from},${limit} `

        return await new Promise(resolve => {
            this.sql.query(q, (error, data) => resolve({ error, data }))
        })
    }

    /**
     * @param {Object} dataInput 
     * @param {Object} dataInput.conditions
     * @param {Array} dataInput.fields
     * @example get({fields: ['id','name'], conditions: { id: 123 }})
     * // fields : default '*'
     */
    async get(dataInput) {
        const { table } = this
        const { fields, conditions } = dataInput
        let afterWhere = ''
        let getFields = fields && Array.isArray(fields) ? fields.join() : '*'
        const arrConditions = conditions ? Object.entries(conditions) : []

        for (let i = 0; i < arrConditions.length; i++) {
            const [field, value] = arrConditions[i]
            afterWhere += `${field}='${String(value).replace(/\'/g, `\\'`).replace(/\"/g, `\\"`).replace(/\`/g, "\\`")}'`
            if (i < arrConditions.length - 1) afterWhere += ' AND '
        }
        let q = `SELECT ${getFields} FROM ${table}`
        // if has condition
        afterWhere ? q += ` WHERE ${afterWhere}` : ''
        return await new Promise(resolve => this.sql.query(q, (error, data) => resolve({ error, data })))
    }
}

module.exports = BaseModel
