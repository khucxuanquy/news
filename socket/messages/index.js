const { yellow, green } = require('../../config/log')
const message = require('../../controllers/messages')
/**
 * 
 * @param {*} io 
 */
module.exports = ({ io, socket, idStore }) => {
  // trong store myAccount -> luu idUser va idSocketIo
  socket.on('SEND_MESSAGE', async dataInput => {
    let { error, data } = await message.create(dataInput)
    if (error) return;
    // gui cho ban thanh minh
    io.to(socket.id).emit('CLIENT_RECEIVE_MESSAGE', data);
    // tim xem receive_id  co dang online k
    // neu co -> gui realtime
    let index = idStore.usersOnline.findIndex(user => user.id == dataInput.receive_id)
    if (index > -1) {
      idStore.usersOnline[index].socketIds.forEach(id => {
        io.to(id).emit('CLIENT_RECEIVE_MESSAGE', data);
      });
      // socket.broadcast.emit('message_client', data)
    }
  });
};

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8