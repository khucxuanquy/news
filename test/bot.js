require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

// const { TOKEN, SERVER_URL } = process.env
const TOKEN = '1985463612:AAH6y9i0x_bVoceh3Xj4uq3E1gBO0HSGzS0'
const SERVER_URL = 'https://aa8f-42-113-159-128.ngrok.io'

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const REGISTER_WEBHOOK = `/webhook/${TOKEN}`
const WEBHOOK_URL =  SERVER_URL + REGISTER_WEBHOOK

const app = express()
app.use(bodyParser.json())

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
  console.log(1321312, res.data)
}

app.post(REGISTER_WEBHOOK, async (req, res) => {
    const chat_id = req.body.message?.chat?.id
    const text = req.body.message?.text || 'Úi, không giám nhại sticker đâu ❤️❤️'
    console.log(25, req.body.message, text)
    if(!chat_id || chat_id < 0) return res.send('webhook chặn gửi vào nhóm')
    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id, text })
    return res.send()
})

app.get('*', (req,res) => res.send('ok'))

app.listen(5000, async () => {
  console.log('🚀 app running on port', 5000)
  init()
  // axios.get('https://vnexpress.net/microservice/sheet/type/vaccine_covid_19')
  // .then(({ data: res }) => {
  //   let showData = res.data.find(i => i['country-other'] == 'Vietnam')
  //   console.log(showData)
  // })

  // axios.get('https://www.youtube.com/watch?v=d44UTUSTYKU&ab_channel=SOOBINOfficial')
  // .then((res) => {
  //   console.log(res)
  // })
  
  // await init()
})