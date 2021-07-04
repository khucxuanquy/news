const { yellow, green } = require('../../config/log')
/**
 * 
 * @param {*} io 
 */
module.exports = ({ io, socket, STORE }) => {


  socket.on('CLIENT_HAS_READ_THE_NOTICE', async ({ myAccountId, sender_id }) => {
    if(!myAccountId) return;
    delete STORE.notification[myAccountId][sender_id]

    let checkOnline = STORE.usersOnline[myAccountId]
    if (checkOnline) {
      checkOnline.forEach(id => {
        io.to(id).emit('SERVER_SEND_NOTIFICATION', STORE.notification[myAccountId] || {})
      });
    }
  })
  socket.on('CLIENT_GET_NOTICE', async ({ myAccountId }) => {
    if(!myAccountId) return;
    let checkOnline = STORE.usersOnline[myAccountId]
    // nếu online
    if (checkOnline && STORE.notification[myAccountId]) {
      checkOnline.forEach(id => {
        io.to(id).emit('SERVER_SEND_NOTIFICATION', STORE.notification[myAccountId])
      });
    }
  })
};

// function sendDataRealtimeToClient(){
//   io.emit
// }

// https://viblo.asia/p/tat-tan-tat-nhung-lenh-emit-trong-socketio-Qbq5Qj8wKD8