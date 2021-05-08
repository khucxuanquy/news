const MESSAGES = require('./messages');
const NOTIFICATION = require('./notification');
const USERS = require('./users');
const l = require('../config/log');

let idStore = {
  usersOnline: []// {id:'', socketIds: ['','']}
}
module.exports = io => {
  io.on("connection", socket => {
    MESSAGES({ io, socket, idStore });
    NOTIFICATION({ io, socket, idStore });
    USERS({ io, socket, idStore });

    socket.on('disconnect', () => { })
  })
};
