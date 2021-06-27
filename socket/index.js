const MESSAGES = require('./messages');
const NOTIFICATION = require('./notification');
const USERS = require('./users');
const l = require('../config/log');
let count = 0;
let STORE = {
  usersOnline: {},  // {id:'', socketIds: ['','']}
  // '---id---' : [...,...]
}
setInterval(() => {
  count++;
  console.log(count, 'socket/ ', STORE.usersOnline);
}, 60000);
module.exports = io => {
  io.on("connection", socket => {
    MESSAGES({ io, socket, STORE });
    NOTIFICATION({ io, socket, STORE });
    USERS({ io, socket, STORE });

    socket.on('disconnect', () => { })
  })
};
