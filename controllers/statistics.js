const Statistics = require('../models/statistics')
const statistic = new Statistics()
const { resFail, resSuccess } = require('../helpers')
const cacheRedis = require('../models/cacheRedis')
const cron = require('cron');

new cron.CronJob({
    // cronTime: '* * * * *',  // At every minute
    cronTime: '0 * * * *', // At minute 0 past every hour
    // cronTime: '*/30 * * * *', // At every 30th minute
    start: true,
    timeZone: 'Asia/Ho_Chi_Minh', // Lưu ý set lại time zone cho đúng 
    onTick: async function () {
        let { data } = await cacheRedis.getCache({ key: 'statistics' })
        // for cacheRedis
        // data = data ? JSON.parse(data) : []

        // for Not install cacheRedis
        data = data || []
        
        data.forEach(item => statistic.create(item));
        await cacheRedis.deleteCache({ key: 'statistics' })
    },
}).start();

module.exports = {
    async delete(req, res) {
        const { id } = req.query
        let { error } = await statistic.delete(id)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess())
    },
    async getStatistics(req, res) {
        let { error, data } = await statistic.getStatistics(req.query)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
    async getByDatePicker(req, res) {
        let { error, data } = await statistic.getByDatePicker(req.query)
        if (error) return res.send(resFail({ error }))
        res.send(resSuccess({ data }))
    },
}
