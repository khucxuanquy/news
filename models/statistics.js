const baseModel = require('../baseModels/baseModel');
const { rangeMonth, rangeWeek, ONE_HOUR, ONE_DAY, ONE_WEEK, ONE_MONTH, ONE_YEAR, convertDate } = require('../helpers')

class Statistics extends baseModel {
    constructor() {
        super('statistics')
        this.id = ''
        this.post_id = ''
        this.view = 0
        this.dateCreated = ''
    }

    setter(dataInput) {
        if (dataInput.id) this.id = String(dataInput.id)
        if (dataInput.post_id) this.post_id = String(dataInput.post_id)
        if (dataInput.view) this.view = Number(dataInput.view)
        this.dateCreated = dataInput.dateCreated || +new Date()
    }

    getter() {
        let data = {}
        data.id = this.id
        data.post_id = this.post_id
        data.view = this.view
        data.dateCreated = this.dateCreated
        return data
    }

    async getByDatePicker(dataInput) {
        let arrDate = [],
            arrQuery = [],
            { start, end } = dataInput;
        const rangeDate = end - start;

        if (end - start < ONE_MONTH * 3) {
            arrDate.push(end)
            while (end - start > 0) {
                if (rangeDate < ONE_DAY + ONE_HOUR) end = String(Number(end) - ONE_HOUR)
                else if (rangeDate < ONE_WEEK * 2) end = String(Number(end) - ONE_DAY)
                else end = String(Number(end) - ONE_WEEK)
                arrDate.unshift(end)
            }
        } else {
            /*  end: new Date().setHours(0,0,0,0).setDate(1) */
            // new Date(new Date().setHours(0,0,0,0)).setMonth(1,1)
        }

        for (let i = 0; i < arrDate.length - 1; i++) {
            // đảo ngược lại dateCreated do push `end` vào arrDate
            arrQuery.push(`SELECT sum(view) as 'totalView' FROM statistics WHERE dateCreated BETWEEN '${arrDate[i]}' AND '${arrDate[i + 1]}'`)
        }
        return Promise.all(arrQuery.map(query => new Promise(resolve => {
            this.sql.query(query, (err, data) => err ? resolve([]) : resolve(data))
        })))
            .then(res => {
                // for (let i = 1; i < arrDate.length; i++) data[i - 1][0].date = arrDate[i];
                arrDate.pop(arrDate.length - 1) // remove last item
                arrDate = rangeDate < (ONE_DAY + ONE_HOUR) ? arrDate.map(date => convertDate(4, Number(date))) : arrDate.map(date => convertDate(3, Number(date)))
                let data = {
                    labels: arrDate,
                    datasets: [
                        {
                            label: 'chart-view',
                            data: res.map(i => i[0].totalView || 0)
                        }
                    ]
                }

                return Promise.resolve({ data })
            }).catch(error => {
                console.log('\x1b[31m', error)
                return Promise.resolve({ error })
            })
    }
    async getStatistics() {
        // ONE_HOUR
        let _rangeWeek = rangeWeek(+new Date())
        let arrQuery = [
            `SELECT posts.title, SUM(statistics.view) as 'totalView' FROM statistics INNER JOIN posts ON posts.id = statistics.post_id WHERE statistics.dateCreated BETWEEN '${+_rangeWeek.start}' AND '${+_rangeWeek.end}' GROUP BY posts.title  ORDER BY totalView DESC`,
            `SELECT posts.category_id, SUM(statistics.view) as 'totalView' FROM statistics INNER JOIN posts ON posts.id = statistics.post_id WHERE statistics.dateCreated BETWEEN '${+_rangeWeek.start}' AND '${+_rangeWeek.end}' GROUP BY posts.category_id ORDER BY totalView DESC`,
        ]

        return Promise.all(arrQuery.map(query => new Promise(resolve => {
            this.sql.query(query, (err, data) => err ? resolve([]) : resolve(data))
        })))
            .then(res => {
                const groupByPostTitle = res[0], // thong ke views by posts.title
                    categoryMostInterest = res[1] // thong ke views by category
                return Promise.resolve({ data: { groupByPostTitle, categoryMostInterest } })
            }).catch(error => {
                console.log('\x1b[31m', error)
                return Promise.resolve({ error })
            })
    }
}

module.exports = Statistics