const { yellow, green } = require('../../config/log')
// const controllers = require('../../controllers/index')
// controllers.categories.create(data)
/**
 * 
 * @param {*} io 
 */
module.exports = (socket) => {
  // trong store myAccount -> luu idUser va idSocketIo
  // socket.on('users_allLive', data => {
  //   socket.emit('get_list_users_online', data)
  //   // io.to(socket.id).emit('message_client', data);
  // });

  return {
    sendMessageToClient(event, data){
      socket.emit(event, data)
    }
  }
};

// function sendDataRealtimeToClient(){
//   io.emit
// }

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8