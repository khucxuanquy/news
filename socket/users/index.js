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
};

// function sendDataRealtimeToClient(){
//   io.emit
// }

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8