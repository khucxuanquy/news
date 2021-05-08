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

    // // special !!
    socket.on('GET_USERS_ONLINE', isFirstConnect => {
      // if(isFirstConnect) io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
      // else socket.broadcast.emit('LIST_USERS_ONLINE', users_online)
      // io.sockets.emit('LIST_USERS_ONLINE', users_online)
      setTimeout(() => {
        io.sockets.emit('LIST_USERS_ONLINE', idStore.usersOnline.map(i => i.id))
      }, 100);
      // else io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
    })

    socket.on('user_connected', data => {
      if (data && !data.id) return;
      // tim dia chi user
      let index = idStore.usersOnline.findIndex(user => user.id == data.id);
      if (index > -1) idStore.usersOnline[index].socketIds.push(socket.id);
      else idStore.usersOnline.push({ id: data.id, socketIds: [socket.id] });
    })

    socket.on('user_disconnected', data => {
      let { id, socketId } = data
      let index = idStore.usersOnline.findIndex(user => user.id == id);
      if (index > -1) {
        let indexSocketId = idStore.usersOnline[index].socketIds.indexOf(socketId);
        if (indexSocketId > -1) idStore.usersOnline[index].socketIds.splice(index, 1)
        // neu socketIds : [] => xoa ca object
        if (!idStore.usersOnline[index].socketIds.length) {
          idStore.usersOnline.splice(index, 1)
        }
      }
    })

    socket.on('disconnect', () => { })
  })
};
