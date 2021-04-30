const Statistics = require('../models/statistics')
const statistic = new Statistics()
const { resFail, resSuccess, randomId } = require('../helpers')

module.exports = {
    async create(req, res) {
        req.body.id = randomId()
        let { error } = await statistic.create(req.body)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())

    },

    async delete(req, res) {
        const { id } = req.query
        let { error } = await statistic.delete(id)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())
    },
    async getStatistics(req, res) {
        const {} = req.query
        /*
            SELECT posts.title, SUM(statistic.view) as 'tong' FROM `statistic` INNER JOIN `posts` ON posts.id = statistic.post_id GROUP BY posts.title
            SELECT posts.category_id, SUM(statistic.view) as 'tong' FROM `statistic` INNER JOIN `posts` ON posts.id = statistic.post_id GROUP BY posts.category_id
            SELECT posts.title, SUM(statistic.view) as 'tong' FROM `statistic` INNER JOIN `posts` ON posts.id = statistic.post_id GROUP BY posts.title
         */
    }

    // async getReports(req, res) {
    //     let { error, data } = await statistic.getReports(req.token)
    //     if (error) return res.send(resFail({ error }))
    //     res.send(resSuccess({ data }))
    // },
}
