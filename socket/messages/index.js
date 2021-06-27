const { yellow, green } = require('../../config/log');
// const messages = require('../../controllers/messages');
const message = require('../../controllers/messages');
/**
 * 
 * @param {*} io 
 */
module.exports = ({ io, socket, STORE }) => {
  // trong store myAccount -> luu idUser va idSocketIo
  socket.on('CLIENT_SEND_NEW_MESSAGE', async dataInput => {
    if(!dataInput.content) return;
    let { error, data } = await message.create(dataInput)
    if (error) return;
    // gui cho ban thanh minh
    io.to(socket.id).emit('CLIENT_RECEIVE_NEW_MESSAGE', data);
    // tim xem receive_id  co dang online k
    // neu co -> gui realtime
    let checkOnline = STORE.usersOnline[dataInput.receive_id]
    if (checkOnline) {
      checkOnline.forEach(id => {
        io.to(id).emit('CLIENT_RECEIVE_NEW_MESSAGE', data);
      });
      // socket.broadcast.emit('message_client', data)
    }
  });

  socket.on('CLIENT_GET_MESSAGES', async dataInput => {
    let { receive_id, sender_id, from, limit } = dataInput
    let { error, data } = await message.getMessage({ receive_id, sender_id, from, limit })
    if (error) return;
    io.to(socket.id).emit('SERVER_SEND_MESSAGES', data)
  })

  socket.on('CLIENT_SEND_ENTERING', async ({ sender_id, receive_id, isEntering }) => {
    if(STORE.usersOnline[receive_id]) {
      STORE.usersOnline[receive_id].forEach(socketId => {
        io.to(socketId).emit('SERVER_SEND_ENTERING', { sender_id: sender_id, isEntering: isEntering })
      })
    }
  })

};

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8