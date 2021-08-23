const Posts = require('../models/posts')
const cacheRedis = require('../models/cacheRedis')
const post = new Posts()
const DEFAULT_FIELDS = ['id', 'category_id', 'activated', 'description', 'title', 'url', 'image', 'view', 'user_id', 'dateCreated'].join()
const DEFAULT_FIELDS_HOME = ['id', 'category_id', 'description', 'title', 'url', 'image', 'dateCreated'].join()
const FIELDS_GET_TO_EDIT = ['category_id', 'content', 'description', 'title', 'image']
const { resFail, resSuccess, accentedLetters } = require('../helpers')

module.exports = {
    async create(req, res) {
        const { id } = req.token
        req.body.user_id = id
        req.body.category_id = req.body.category
        req.body.url = accentedLetters(req.body.title)
        let { error, data } = await post.create(req.body)
        if (error) return res.send(resFail({ error }))
        // xóa sectionBottom trong redis
        cacheRedis.deleteCache({ key: 'sectionBottom' });
        res.send(resSuccess({ data }))
    },
    async edit(req, res) {
        if (req.body.title) req.body.url = accentedLetters(req.body.title)
        let { error } = await post.edit(req.body)
        if (error) return res.send(resFail({ error }))
        // xóa sectionBottom trong redis
        cacheRedis.deleteCache({ key: 'sectionBottom' });
        res.send(resSuccess())
    },
    async delete(req, res) {
        const { id } = req.query
        let { error } = await post.delete(id)
        if (error) return res.send(resFail({ error }))
        // xóa sectionBottom trong redis
        cacheRedis.deleteCache({ key: 'sectionBottom' });
        res.send(resSuccess())
    },
    async getPostsByPermission(req, res) {
        const { id, permission } = req.token
        let { fields, limit, from, search } = req.query
        let dataInput = {
            id,
            permission,
            from: from || 0,
            search: search || '',
            fields: fields || DEFAULT_FIELDS,
        }
        // maximum limit
        if (limit && limit > 50) dataInput.limit = 50
        dataInput.limit = limit || 15

        let { error, data, total_posts } = await post.getPostsByPermission(dataInput)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data, total_posts }))
    },
    async searchByPermission(req, res) {
        const { id, permission } = req.token
        let dataInput = {
            id,
            permission,
            q: req.query.q || ' ',
            fields: req.query.fields || DEFAULT_FIELDS,
        }

        let { error, data } = await post.searchByPermission(dataInput)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
    async search(req, res) {
        if (!req.query.query) return res.send(resSuccess({ data: [] }))
        req.query.fields = DEFAULT_FIELDS_HOME
        req.query.search = req.query.query
        let { error, data } = await post.getAll(req.query)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
    /**
     * get in edit form
     */
    async get(req, res) {
        let dataInput = { fields: FIELDS_GET_TO_EDIT, conditions: { id: req.query.id } }
        let { error, data } = await post.get(dataInput)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data: data[0] }))
    },
    async getContent(req, res) {
        let { error, data, related_post } = await post.getContent(req.query)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data, related_post }))
    },
    async getPostsByCategory(req, res) {
        let { limit, from } = req.query
        if (limit && limit > 50) limit = 50
        req.body.from = from || 0
        req.body.limit = limit || 10
        let { error, data } = await post.getPostsByCategory(req.query)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
    async home(req, res) {
        // // tìm trong redis có data không
        // let { data: sectionBottom } = await cacheRedis.getCache({ key: 'sectionBottom' });
        // // nếu có thì không cần phải query
        // if(sectionBottom) req.query.sectionBottom = false;
        let { error, data } = await post.home({ DEFAULT_FIELDS_HOME, dataGetting: req.query })
        if (error) return res.send(resFail({ error }))
        // nếu có thì trả về data trong redis không thì lưu nó vào redis
        // if(sectionBottom) data.sectionBottom = sectionBottom;
        // else cacheRedis.setCacheDefault({ key: 'sectionBottom', value: data.sectionBottom });
        res.send(resSuccess({ data }))
    },
    async overviewStatistic(req, res) {
        let { error, data } = await post.overviewStatistic()
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
    async statisticUser(req, res) {
        let { error, data } = await post.statisticUser(req.token)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    }
}