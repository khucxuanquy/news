const { yellow, green } = require('../../config/log')
// const controllers = require('../../controllers/index')
// controllers.categories.create(data)
/**
 * 
 * @param {*} io 
 */
module.exports = (socket, idStore) => {
  // trong store myAccount -> luu idUser va idSocketIo
  socket.on('message_server', data => {
    // console.log(11, data, idStore)
    socket.broadcast.emit('message_client', data)
    // io.to(socket.id).emit('message_client', data);
  });
  // io.to(socket.id).emit("event", 'hi');
};

// function sendDataRealtimeToClient(){
//   io.emit
// }

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8