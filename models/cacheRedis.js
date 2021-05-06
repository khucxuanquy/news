const redis = require('redis')
const { randomId } = require('../helpers')
class CacheRedis {
  constructor() {
    this.client = redis.createClient({ host: '127.0.0.1', port: 6379, prefix: 'cache:', db: 0 })
  }

  /**
   * danh rieng cho post model
   */
  async setCache({ key, value }) {
    const post_id = value
    if (!key || !value) return { error: 'param invalid' };
    let { error, data: dataGetCache } = await this.getCache({ key })
    if (error) return { error, message: 'Can not get key redis' }

    dataGetCache = dataGetCache ? JSON.parse(dataGetCache) : []
    return await new Promise(resolve => {
      let index = dataGetCache.findIndex(i => i.post_id == post_id)
      if (index > -1) dataGetCache[index].view += 1
      else dataGetCache.push({
        id: randomId(),
        post_id,
        view: 1,
        dateCreated: String(new Date().setMinutes(1, 0, 0))
      })
      this.client.set(key, JSON.stringify(dataGetCache), (error, data) => resolve({ error, data }))
    })
  }

  async deleteCache({ key }) {
    if (!key) return { error: 'param KEY invalid' };
    return await new Promise(resolve => {
      this.client.del(key, (error, data) => resolve({ error, data }))
    })
  }

  // async setCacheExpiration({ key, value, time }) {
  //   if (!key || !value || !time) return { error: 'param invalid' };
  //   return await new Promise(resolve => {
  //     this.client.setex(key, time, JSON.stringify(value), (error, data) => resolve({ error, data }))
  //   })
  // }

  async getCache({ key }) {
    if (!key) return { error: 'param KEY invalid' };
    return await new Promise(resolve => {
      this.client.get(key, (error, data) => resolve({ error, data }))
    })
  }
}

// for installed redis
// module.exports = new CacheRedis()

// for not install redis

module.exports = {
  deleteCache() {
    return {}
  },
  getCache() {
    return {
      error: null,
      data: []
    }
  },
  setCache() {
    return {}
  }
}