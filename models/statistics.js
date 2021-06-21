const baseModel = require('../baseModels/baseModel');
const { rangeWeek, ONE_HOUR, ONE_DAY, ONE_WEEK, ONE_MONTH, convertDate, rangeMonth } = require('../helpers')

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
        const RANGE_DATE = end - start;
        start = new Date(Number(start)).setHours(0, 0, 0, 0);
        if (RANGE_DATE > ONE_DAY + ONE_HOUR) end = new Date(Number(end)).setHours(0, 0, 0, 0);

        if (end - start < ONE_MONTH * 3) {
            arrDate.push(end)
            while (end - start > 0) {
                if (RANGE_DATE < ONE_DAY + ONE_HOUR) end = String(Number(end) - ONE_HOUR)
                else if (RANGE_DATE < ONE_WEEK * 2) end = String(Number(end) - ONE_DAY)
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
                arrDate = RANGE_DATE < (ONE_DAY + ONE_HOUR) ? arrDate.map(date => convertDate(4, Number(date))) : arrDate.map(date => convertDate(3, Number(date)))
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

    async statisticCategories(dataInput) {
        let arrDate = [], arrQuery = [],
            { start, end, categoryIds } = dataInput;
        let queryCategories = ''

        const RANGE_DATE = end - start;
        if (RANGE_DATE > ONE_DAY + ONE_HOUR) {
            start = new Date(Number(start)).setHours(0, 0, 0, 0);
            end = new Date(Number(end)).setHours(0, 0, 0, 0);
        }

        // TH co arr categoryIds ['','']
        if (categoryIds && categoryIds.length) {
            let i = 0;
            while (i < categoryIds.length) {
                queryCategories += `,'${categoryIds[i]}'`
                ++i;
            }
            queryCategories = queryCategories.slice(1, queryCategories.length)
            queryCategories = `AND category_id IN (${queryCategories})`
        }

        if (end - start < ONE_MONTH * 3) {
            arrDate.push(end)
            while (end - start > 0) {
                if (RANGE_DATE < ONE_DAY + ONE_HOUR) end = String(Number(end) - ONE_HOUR)
                else if (RANGE_DATE < ONE_WEEK * 2) end = String(Number(end) - ONE_DAY)
                else end = String(Number(end) - ONE_WEEK)
                arrDate.unshift(end)
            }
        } else {
            /*  end: new Date().setHours(0,0,0,0).setDate(1) */
            // new Date(new Date().setHours(0,0,0,0)).setMonth(1,1)
        }

        for (let i = 0; i < arrDate.length - 1; i++) {
            // đảo ngược lại dateCreated do push `end` vào arrDate
            arrQuery.push(`SELECT posts.category_id, SUM(statistics.view) as 'totalView' FROM statistics INNER JOIN posts ON posts.id = statistics.post_id WHERE statistics.dateCreated BETWEEN '${arrDate[i]}' AND '${arrDate[i + 1]}' ${queryCategories} GROUP BY posts.category_id`)
        }
        return Promise.all(arrQuery.map(query => new Promise(resolve => {
            this.sql.query(query, (err, data) => err ? resolve([]) : resolve(data))
        })))
            .then(res => {
                arrDate.pop(arrDate.length - 1) // remove last item
                arrDate = RANGE_DATE < (ONE_DAY + ONE_HOUR) ? arrDate.map(date => convertDate(4, Number(date))) : arrDate.map(date => convertDate(3, Number(date)))

                let arrCategory = []
                if (categoryIds && categoryIds.length) arrCategory = categoryIds;
                else {
                    let temp = {}
                    for (let i = 0; i < res.length; i++) {
                        for (let j = 0; j < res[i].length; j++) {
                            if (!temp[res[i][j].category_id]) {
                                temp[res[i][j].category_id] = 1;
                                arrCategory.push(res[i][j].category_id)
                            }
                        }
                    }
                }

                let data = {
                    labels: arrDate,
                    datasets: arrCategory.map(category_id => {
                        return {
                            label: category_id,
                            data: res.map(arrChild => {
                                let obj = arrChild.find(i => i.category_id === category_id);
                                return obj ? obj.totalView : 0;
                            })
                        }
                    })
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
            `SELECT posts.title, SUM(statistics.view) as 'totalView' FROM statistics INNER JOIN posts ON posts.id = statistics.post_id WHERE statistics.dateCreated BETWEEN '${+_rangeWeek.start}' AND '${+_rangeWeek.end}' GROUP BY posts.title ORDER BY totalView DESC`,
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