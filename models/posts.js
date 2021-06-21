const baseModel = require('../baseModels/baseModel')
const { rangeMonth, rangeWeek, ONE_HOUR, ONE_DAY } = require('../helpers')
const cacheRedis = require('./cacheRedis')

class Posts extends baseModel {
    constructor() {
        super('posts')
        this.id = ''
        this.category_id = ''
        this.title = ''
        this.url = ''
        this.description = ''
        this.image = ''
        this.content = ''
        this.user_id = 'admin'
        this.activated = 'false'
        this.view = 0
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.category_id) this.category_id = String(dataInput.category_id)
        if (dataInput.title) this.title = String(dataInput.title)
        if (dataInput.url) this.url = String(dataInput.url)
        if (dataInput.description) this.description = String(dataInput.description)
        if (dataInput.image) this.image = String(dataInput.image)
        if (dataInput.content) this.content = String(dataInput.content)
        if (dataInput.user_id) this.user_id = String(dataInput.user_id)
        if (dataInput.activated) this.activated = String(dataInput.activated)
        if (dataInput.view) this.view = String(dataInput.view)
        this.dateCreated = +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.category_id = this.category_id
        data.title = this.title
        data.url = this.url
        data.description = this.description
        data.image = this.image
        data.content = this.content
        data.user_id = this.user_id
        data.activated = this.activated
        data.view = this.view
        data.dateCreated = this.dateCreated
        return data
    }

    async getTotalPostByPermission({ permission, id }) {
        if (permission == 3) {
            return await new Promise(resolve => {
                this.sql.query(`select * from total_posts`, (error, data) => resolve({ error, data: data[0].sum }))
            })
        }
        let count = `select COUNT(id) as sum from posts `

        if (permission == 2) count += `WHERE posts.user_id IN (SELECT id from users WHERE id = '${id}' OR manager_id = '${id}') `
        else count += `WHERE posts.user_id = '${id}' `

        return await new Promise(resolve => {
            this.sql.query(count, (error, data) => resolve({ error, data: data[0].sum }))
        })
    }

    /**
     * 
     * @param {Object} dataInput
     * @param {String} dataInput.id - id user
     * @param {String} dataInput.fields
     * @param {String} dataInput.limit
     * @param {String} dataInput.search
     * @param {Number} dataInput.from
     * @param {Number} dataInput.permission
     * @returns 
     */
    async getPostsByPermission(dataInput) {
        let { fields, limit, from, id, permission, search } = dataInput

        let { error: error1, data: total_posts } = await this.getTotalPostByPermission({ permission, id })
        // admin
        if (permission == 3) {
            if (error1) return { error }
            let { error, data } = await this.getAll({ fields, limit, from, search })
            return { error, data, total_posts }
        }
        else {
            let q = `SELECT ${fields} FROM posts `
            if (permission == 2) q += `WHERE posts.user_id IN (SELECT id from users WHERE id = '${id}' OR manager_id = '${id}') `
            else q += `WHERE posts.user_id = '${id}' `
            q += `ORDER BY dateCreated DESC limit ${from},${limit} `
            return await new Promise(resolve => {
                this.sql.query(q, (error, data) => resolve({ error, data, total_posts }))
            })
        }
    }
    async searchByPermission(dataInput) {
        let { q, fields, id, permission } = dataInput

        let query = `SELECT ${fields} FROM posts `

        if (permission == 3) query += `WHERE title LIKE '%${q}%' OR description LIKE '%${q}%' `
        else {
            if (permission == 2) query += `WHERE posts.user_id IN (SELECT id from users WHERE id = '${id}' OR manager_id = '${id}') `
            else query += `WHERE posts.user_id = '${id}' `

            query += `AND title LIKE '%${q}%' OR description LIKE '%${q}%' `
        }
        query += `limit 0,8`
        return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data }))
        })
    }
    // async getTopPostByCategory(category_id) {
    //     if (!category_id) return { error: 1 }

    //     let queryGetTopPost = `SELECT title, posts.url as url, image FROM posts INNER JOIN categories ON categories.id = posts.category_id WHERE categories.id = '${category_id}' ORDER BY view DESC limit 0, 6`
    //     return await new Promise(resolve => {
    //         this.sql.query(queryGetTopPost, (error, data) => resolve({ error, data: data }))
    //     })
    // }
    async getContent(dataInput) {
        let { category_url, post_url, isNewCategory } = dataInput
        if (!post_url || !category_url) return;
        post_url = post_url.replace(/\'/g, `\\'`).replace(/\"/g, `\\"`).replace(/\`/g, "\\`")
        let q = `SELECT posts.id as id, title, image, content, posts.view as view, posts.dateCreated, categories.id as category_id FROM posts INNER JOIN categories ON posts.category_id = categories.id WHERE categories.url='${category_url}' AND posts.url='${post_url}' AND posts.activated LIKE 'true'`

        return await new Promise(resolve => {
            // get post
            this.sql.query(q, async (error, data) => {
                if (error) return resolve({ error })
                if (!data.length) return resolve({ data: [] })
                // if post exist -> view++
                let { id, view, category_id } = data[0],
                    related_post = []
                delete data[0].view // xoa view roi gui sang client

                // edit view
                this.edit({ id, view: ++view })
                cacheRedis.setCache({ key: 'statistics', value: id })
                if (JSON.parse(isNewCategory)) {
                    let queryGetTopPost = `SELECT title, posts.url as url, image FROM posts INNER JOIN categories ON categories.id = posts.category_id WHERE categories.id = '${category_id}' AND posts.activated LIKE 'true' ORDER BY view DESC limit 0, 6`
                    let { error, data } = await new Promise(resolve => this.sql.query(queryGetTopPost, (error, data) => resolve({ error, data })))
                    if (error) data = []
                    related_post = data
                }
                resolve({ error, data: data[0], related_post })
            })
        })
    }

    async getPostsByCategory(dataInput) {
        let { category_url, limit, from } = dataInput
        let select = ['posts.title', 'posts.image', 'posts.url', 'posts.description', 'posts.dateCreated', 'categories.id as category_id'].join();
        let q = `SELECT ${select} FROM posts INNER JOIN categories ON posts.category_id = categories.id `;
        if (category_url && category_url != 'news') q += `WHERE categories.url='${category_url}' && posts.activated LIKE 'true' `;
        else q += `WHERE posts.activated LIKE 'true' `
        q += `ORDER BY dateCreated DESC limit ${from}, ${limit}`;

        return await new Promise(resolve => {
            this.sql.query(q, (error, data) => resolve({ error, data }))
        })
    }

    async home({ DEFAULT_FIELDS_HOME }) {
        let arrCategories = await new Promise(resolve => this.sql.query(`SELECT * FROM top_view_categories`, (err, r) => resolve(r)))
        // 8 bài mới nhất 
        // 4 bài hay nhất 7 ngay qua
        // 4 bài hay nhất 30 ngay qua
        // 2 chủ đề nhiều người quan tâm nhất ( tổng views ) => lấy 5 bài
        const SELECT = `SELECT ${DEFAULT_FIELDS_HOME} FROM posts`

        let arrQuery = [
            `${SELECT} WHERE posts.activated LIKE 'true' ORDER BY dateCreated DESC limit 0, 8`,
            `${SELECT} WHERE posts.activated LIKE 'true' AND dateCreated BETWEEN '${+new Date() - ONE_DAY * 7}' AND '${+new Date()}' ORDER BY view DESC limit 0, 4`,
            `${SELECT} WHERE posts.activated LIKE 'true' AND dateCreated BETWEEN '${+new Date() - ONE_DAY * 30}' AND '${+new Date()}' ORDER BY view DESC limit 0, 4`
        ]

        for (const i of arrCategories) {
            arrQuery.push(`SELECT posts.id, title, posts.url as url, image, posts.dateCreated FROM posts INNER JOIN categories ON categories.id = posts.category_id WHERE posts.activated LIKE 'true' AND categories.id = '${i.id}' ORDER BY view DESC limit 0, 4`)
        }

        return Promise.all(arrQuery.map(query => new Promise(resolve => {
            this.sql.query(query, (err, data) => err ? resolve([]) : resolve(data))
        })))
            .then(res => {
                // const topNewFeed = res[0]
                // const topPostsOfWeek = res[1]
                // const topPostsOfMonth = res[2]
                let [topNewFeed, topPostsOfWeek, topPostsOfMonth, ...filterPostByCategories] = res
                // bài viết nhiều view nhất của chủ đề
                let sectionBottom = {}
                for (let i = 0; i < filterPostByCategories.length; i++) {
                    if(filterPostByCategories[i] && filterPostByCategories[i].length) {
                        sectionBottom[arrCategories[i].id] = filterPostByCategories[i]
                    }
                }
                // if(res[3] && res[3].length) sectionBottom[arrCategories[0].id] = res[3]
                // if(res[4] && res[4].length) sectionBottom[arrCategories[1].id] = res[4]
                return Promise.resolve({ data: { topNewFeed, topPostsOfWeek, topPostsOfMonth, sectionBottom } })
            }).catch(error => {
                console.log('\x1b[31m', error)
                return Promise.resolve({ error })
            })

    }

    async overviewStatistic() {
        let _week = rangeWeek(+new Date())
        let _month = rangeMonth(+new Date())
        let _date = { start: +new Date(new Date().setHours(0, 0, 0, 0)), end: +new Date() }

        let SELECT = `SELECT COUNT(id) as quantity FROM posts `
        let arrQuery = [
            `${SELECT} WHERE activated LIKE 'true' AND dateCreated BETWEEN '${_date.start}' AND '${_date.end}'`,
            `${SELECT} WHERE activated LIKE 'true' AND dateCreated BETWEEN '${+_week.start}' AND '${+_week.end}'`,
            `${SELECT} WHERE activated LIKE 'true' AND dateCreated BETWEEN '${+_month.start}' AND '${+_month.end}'`,
            `SELECT posts.user_id, COUNT(id) as amountPosts, SUM(posts.view) as totalView FROM posts WHERE activated LIKE 'true' AND dateCreated BETWEEN '${+_week.start}' AND '${+_week.end}' GROUP BY posts.user_id`,
            `SELECT posts.user_id, COUNT(id) as amountPosts, SUM(posts.view) as totalView FROM posts WHERE activated LIKE 'true' AND dateCreated BETWEEN '${+_month.start}' AND '${+_month.end}' GROUP BY posts.user_id`,
            `SELECT SUM(view) as totalView, COUNT(id) as totalPost FROM posts`
        ]

        return Promise.all(arrQuery.map(query => new Promise(resolve => {
            this.sql.query(query, (err, data) => err ? resolve([]) : resolve(data))
        })))
            .then(res => {
                let quantityInDate = res[0][0].quantity,
                    quantityInWeek = res[1][0].quantity,
                    quantityInMonth = res[2][0].quantity,
                    topEmployeesInWeek = res[3],
                    topEmployeesInMonth = res[4],
                    totalView = res[5][0] ? res[5][0].totalView : 0,
                    totalPost = res[5][0] ? res[5][0].totalPost : 0;
                return Promise.resolve({ data: { quantityInDate, quantityInWeek, quantityInMonth, topEmployeesInWeek, topEmployeesInMonth, totalView, totalPost } })
            }).catch(error => {
                console.log('\x1b[31m', error)
                return Promise.resolve({ error })
            })
    }

    async statisticUser({ id }) {
        if(!id) return { error: 'Thiếu trường id' }
        let query = `SELECT category_id, COUNT(id) as totalPosts, SUM(view) as totalViews FROM posts WHERE user_id = '${id}' GROUP BY category_id`
        return await new Promise(resolve => {
            this.sql.query(query, (error, data) => resolve({ error, data }))
        })
    }

}

module.exports = Posts