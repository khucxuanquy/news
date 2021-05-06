const path = require("path");
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
// create realtime
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: { origin: "http://localhost:8080" }
});

const { startApp } = require('./baseModels/start');
const { l, domains } = require('./config')
const socketIO = require('./socket')
const PORT = 3000

startApp(err => {
  if (err) return console.log(16, err);
  // init socketIO
  socketIO(io)

  app.use('/', express.static('public'))
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

  app.set('view engine', 'ejs');
  // app.get('/', (req, res) => res.render(path.join(__dirname, './views/index.ejs')))

  server.listen(PORT, () => l.cyan(`run at http://localhost:${PORT}`))
})