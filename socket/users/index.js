const { yellow, green } = require('../../config/log')
const users = require('../../controllers/users')
// controllers.categories.create(data)
/**
 * 
 * @param {*} io 
 */
module.exports = ({ io, socket, idStore }) => {
  // trong store myAccount -> luu idUser va idSocketIo
  // socket.on('users_allLive', data => {
  //   socket.emit('get_list_users_online', data)
  //   // io.to(socket.id).emit('message_client', data);
  // });

  socket.on('GET_FRIENDS', async dataInput => {
    let { error, data } = await users.getUsersInMessenger(dataInput)
    if (error) return;
    io.to(socket.id).emit('CLIENT_FRIENDS', data)
    // if(isFirstConnect) io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
    // else socket.broadcast.emit('LIST_USERS_ONLINE', users_online)
    // io.sockets.emit('LIST_USERS_ONLINE', users_online)
    // else io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
  })


  // // special !!
  socket.on('GET_USERS_ONLINE', () => {
    let listUsers = idStore.usersOnline.map(i => i.id)
    io.sockets.emit('LIST_USERS_ONLINE', listUsers)
    // if(isFirstConnect) io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
    // else socket.broadcast.emit('LIST_USERS_ONLINE', users_online)
    // io.sockets.emit('LIST_USERS_ONLINE', users_online)
    // else io.to(socket.id).emit('LIST_USERS_ONLINE', users_online)
  })

  socket.on('USER_CONNECTED', data => {
    if (data && !data.id) return;
    // tim dia chi user
    let index = idStore.usersOnline.findIndex(user => user.id == data.id);
    if (index > -1) idStore.usersOnline[index].socketIds.push(socket.id);
    else idStore.usersOnline.push({ id: data.id, socketIds: [socket.id] });
  })

  socket.on('USER_DISCONNECTED', data => {
    let { id, socketId } = data
    let index = idStore.usersOnline.findIndex(user => user.id == id);
    if (index > -1) {
      let indexSocketId = idStore.usersOnline[index].socketIds.indexOf(socketId);
      if (indexSocketId > -1) {
        idStore.usersOnline[index].socketIds.splice(indexSocketId, 1);
        // neu socketIds : [] => xoa ca object
        if (!idStore.usersOnline[index].socketIds.length) {
          idStore.usersOnline.splice(index, 1)
        }
      }
    }
  })

};

// function sendDataRealtimeToClient(){
//   io.emit
// }

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8