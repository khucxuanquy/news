const { yellow, green } = require('../../config/log');
// const messages = require('../../controllers/messages');
const message = require('../../controllers/messages');
/**
 * 
 * @param {*} io 
 */
module.exports = ({ io, socket, STORE }) => {
  // trong store myAccount -> luu idUser va idSocketIo
  socket.on('CLIENT_SEND_NEW_MESSAGE', async ({ content, receive_id, sender_id }) => {
    if(!content) return;
    let { error, data } = await message.create({ content, receive_id, sender_id })
    if (error) return;
    // gui cho ban than minh
    io.to(socket.id).emit('CLIENT_RECEIVE_NEW_MESSAGE', data);
    // tim xem receive_id  co dang online k
    // neu co -> gui realtime
    let checkOnline = STORE.usersOnline[receive_id]
    if (checkOnline) {
      //Lưu vào notification
      if(STORE.notification[receive_id] && Number(STORE.notification[receive_id][sender_id])) STORE.notification[receive_id][sender_id] += 1;
      else STORE.notification[receive_id] = { [sender_id] : 1}
      checkOnline.forEach(id => {
        io.to(id).emit('CLIENT_RECEIVE_NEW_MESSAGE', data);
        // send notice for partner
        io.to(id).emit('SERVER_SEND_NOTIFICATION', STORE.notification[receive_id], true);
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