const MESSAGES = require('./messages');
const NOTIFICATION = require('./notification');
const USERS = require('./users');
const l = require('../config/log');

let idStore = {
  usersOnline: []
}
module.exports = io => {
  io.on("connection", socket => {
    MESSAGES(socket, idStore);
    NOTIFICATION(socket, idStore);
    USERS(socket, idStore);

    // // special !!
    socket.on('GET_USERS_ONLINE', isFirstConnect => {
      // if(isFirstConnect) io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
      // else socket.broadcast.emit('LIST_USERS_ONLINE', users_online)
      // io.sockets.emit('LIST_USERS_ONLINE', users_online)
      io.sockets.emit('LIST_USERS_ONLINE', idStore.usersOnline)
      // else io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
    })

    socket.on('user_connected', data => {
      if (data && !data.id) return;
      if (!idStore.usersOnline.includes(data.id)) idStore.usersOnline.push(data.id);
    })

    socket.on('user_disconnected', data => {
      let index = idStore.usersOnline.indexOf(data.id);
      idStore.usersOnline.splice(index, 1);
    })

    socket.on('disconnect', () => { })
  })
};
