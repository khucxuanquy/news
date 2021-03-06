const path = require("path");
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
// create realtime
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: { origin: ["http://localhost:3000","http://localhost:8080", "https://doan.khucblog.com/"] }
});

const { startApp } = require('./baseModels/start');
const { l, domains } = require('./config')
const socketIO = require('./socket')
const PORT = 3000

startApp(err => {
  if (err) return console.log(16, err);
  // init socketIO
  socketIO(io)

  app.use('/', express.static('dist'))
  app.use('/static', express.static('static'))
  app.use(cors({ origin: domains, credentials: true }))

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/API/posts', require('./routers/API/posts'))
  app.use('/API/categories', require('./routers/API/categories'))
  app.use('/API/reports', require('./routers/API/reports'))
  app.use('/API/users', require('./routers/API/users'))
  app.use('/API/statistics', require('./routers/API/statistics'))
  app.use('/API/comments', require('./routers/API/comments'))
  app.use('/cdn/upload', require('./routers/CDN/upload'))
  // app.get('/', (req, res) => res.sendFile(path.join(__dirname, './dist/index.html')))
  server.listen(PORT, () => l.cyan(`run at http://localhost:${PORT}`))
})