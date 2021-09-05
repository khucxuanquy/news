const { yellow, green } = require('../../config/log')
const users = require('../../controllers/users');
const { sendMessageToBotTelegram } = require('../../helpers');
// controllers.categories.create(data)
/**
 * 
 * @param {*} io 
 */
module.exports = ({ io, socket, STORE }) => {
  let listUsersOnline = () => {
    let listUsers = []
    for (const key in STORE.usersOnline) {
      listUsers.push(key)
    }
    return listUsers
  }
  // trong store myAccount -> luu idUser va idSocketIo
  // socket.on('users_allLive', data => {
  //   socket.emit('get_list_users_online', data)
  //   // io.to(socket.id).emit('message_client', data);
  // });

  socket.on('CLIENT_GET_CONVERSATIONS', async dataInput => {
    let { error, data } = await users.getUsersInMessenger(dataInput)
    if (error) return;
    io.to(socket.id).emit('SERVER_SEND_CONVERSATIONS', data)
    // if(isFirstConnect) io.to(socket.id).emit('_', users_online)
    // else socket.broadcast.emit('_', users_online)
    // io.sockets.emit('_', users_online)
    // else io.to(socket.id).emit('_', users_online)
  })


  // // special !!
  socket.on('CLIENT_GET_CONVERSATIONS_ONLINE', () => {
    io.sockets.emit('SERVER_SEND_CONVERSATIONS_ONLINE', listUsersOnline())
    // if(isFirstConnect) io.to(socket.id).emit('_', users_online)
    // else socket.broadcast.emit('_', users_online)
    // io.sockets.emit('_', users_online)
    // else io.to(socket.id).emit('_', users_online)
  })

  setInterval(() => io.sockets.emit('SERVER_SEND_CONVERSATIONS_ONLINE', listUsersOnline()), 5000);
  
  // setInterval(() => {
  //   let listUsers = STORE.usersOnline.map(i => i.id)
  //   io.sockets.emit('SERVER_SEND_CONVERSATIONS_ONLINE', listUsers)
  // }, 60000);

  socket.on('USER_CONNECTED', ({ id, socketId, fullName }) => {
    if (!id) return;
    // if id not exist in STORE
    if(!STORE.usersOnline[id]) STORE.usersOnline[id] = []
    if(!STORE.usersOnline[id].includes(socketId)) {
      STORE.usersOnline[id].push(socketId)
    }
    sendMessageToBotTelegram(`[USER_CONNECTED][Số người online: ${Object.entries(STORE.usersOnline).length}] ${fullName} vừa online`)
  })

  socket.on('USER_DISCONNECTED', ({ id, socketId, fullName }) => {
    // if id invalid or id not exist in STORE => return
    if(!id || !STORE.usersOnline[id]) return;
    let index = STORE.usersOnline[id].indexOf(socketId)
    if(index > -1) {
     STORE.usersOnline[id].splice(index, 1)
     if(!STORE.usersOnline[id].length) delete STORE.usersOnline[id]
    }
    sendMessageToBotTelegram(`[USER_DISCONNECTED][Số người online: ${Object.entries(STORE.usersOnline).length}] ${fullName} vừa offline`)
  })

};

// function sendDataRealtimeToClient(){
//   io.emit
// }

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8