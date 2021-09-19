const express = require('express');
const router = express.Router();
const axios = require('axios')
const { API_BOT_TELEGRAM } = process.env
const {sendMessageToBotTelegram } = require('../../helpers/index')
//\\ /webhook/TOKEN
const TOKEN = API_BOT_TELEGRAM.slice(API_BOT_TELEGRAM.indexOf('bot') + 3, API_BOT_TELEGRAM.length - 1)
const WEBHOOK_URL =  `https://doan.khucblog.com/webhook/${TOKEN}`

axios.get(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`)
.then(res => {
  sendMessageToBotTelegram(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`)
  sendMessageToBotTelegram(JSON.stringify(res))
})

router.post(`/${TOKEN}`, async (req, res) => {
  if(!req.body.message) return res.send()
  const chat_id = req.body.message.chat.id
  const text = req.body.message.text || 'Úi, không giám nhại sticker đâu ❤️❤️'
  if(!chat_id || chat_id < 0) return res.send('webhook chặn gửi vào nhóm')
  await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, { chat_id, text })
  return res.send()
})
module.exports = router