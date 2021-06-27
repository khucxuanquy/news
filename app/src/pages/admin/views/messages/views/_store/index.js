import CONST from 'const/const.js'
export default {
  KEY_NAME: '_MESSAGE',
  namespaced: true,
  state: {
    conversations: [],
    boxMessages: [],
    idsUserOnline: [],
    userEntering: []
  },
  getters: {
    conversations: state => state.conversations,
    boxMessages: state => state.boxMessages,
    idsUserOnline: state => state.idsUserOnline,
    userEntering: state => state.userEntering,
  },
  mutations: {
    CHANGE_CONVERSATIONS(state, conversations) {
      if(Array.isArray(conversations)) {
        const { id } = this.getters['_ACCOUNT/myAccount']
        state.conversations = conversations.map(conversation => ({...conversation, dateCreated: CONST.convertDateTimeline(conversation.dateCreated)})).filter(i => i.id !== id)
      }
    },
    CHANGE_MESSAGES(state, boxMessages) {
      state.boxMessages = boxMessages;
    },
    PUSH_MESSAGES_AFTER_GET(state, boxMessages){
      state.boxMessages.unshift(...boxMessages);
    },
    CHAT_NEW_MESSAGE(state, data) {
      let { boxMessages } = state
      const lastBoxMessage = boxMessages[boxMessages.length - 1]

      if (lastBoxMessage && lastBoxMessage.sender_id === data.sender_id) {
        state.boxMessages[boxMessages.length - 1].messages.push({
          id: data.id,
          content: data.content,
          dateCreated: CONST.convertDateTimeline(Number(data.dateCreated)),
        })
      } else state.boxMessages.push({
        sender_id: data.sender_id,
        receive_id: data.receive_id,
        messages: [
          {
            id: data.id,
            content: data.content,
            dateCreated: CONST.convertDateTimeline(Number(data.dateCreated)),
          },
        ],
      })
      //  update conversations khi có new message
      this.commit('_MESSAGE/UPDATE_LAST_MESSAGE_IN_CONVERSATIONS', data)
    },
    CHANGE_CONVERSATIONS_ONLINE(state, idsUserOnline) {
      let ids = state.conversations.filter(conversation => idsUserOnline.includes(conversation.id)).map(conversation => conversation.id)
      state.idsUserOnline = ids
      if(Array.isArray(idsUserOnline) && idsUserOnline.length) {
        state.conversations = state.conversations.map(conversation => ({ ...conversation, status: ids.includes(conversation.id) ? 'online' : '' }))
      }
    },
    UPDATE_LAST_MESSAGE_IN_CONVERSATIONS(state, message) {
      let index = state.conversations.findIndex(conversation => conversation.id === message.receive_id || conversation.id === message.sender_id)
      if(index > -1) {
        const { id } = this.getters['_ACCOUNT/myAccount']
        // nếu tin nhắn từ bạn
        if(message.sender_id === id) state.conversations[index].content = 'Bạn: ' + message.content;
        else state.conversations[index].content = message.content;
        // ngày tạo message
        state.conversations[index].dateCreated = CONST.convertDateTimeline(Number(message.dateCreated))
      }
    },
    CHANGE_USER_ENTERING(state, { sender_id, isEntering }) {
      if(!sender_id) return;
      let index = state.userEntering.findIndex(id => id === sender_id);
      if(index > -1 && !isEntering) return state.userEntering.splice(index, 1);
      state.userEntering.push(sender_id)
    },
  },
  actions: {
    CHANGE_CONVERSATIONS({ commit }, data) {
      commit('CHANGE_CONVERSATIONS', data);
    },
    CHANGE_MESSAGES({ commit }, data) {
      commit('CHANGE_MESSAGES', data);
    },
    CHAT_NEW_MESSAGE({ commit }, data) {
      commit('CHAT_NEW_MESSAGE', data);
    },
    CHANGE_CONVERSATIONS_ONLINE({ commit }, data) {
      commit('CHANGE_CONVERSATIONS_ONLINE', data);
    },
    PUSH_MESSAGES_AFTER_GET({ commit }, data) {
      commit('PUSH_MESSAGES_AFTER_GET', data);
    },
    UPDATE_LAST_MESSAGE_IN_CONVERSATIONS({ commit }, data) {
      commit('UPDATE_LAST_MESSAGE_IN_CONVERSATIONS', data);
    },
    CHANGE_USER_ENTERING({ commit }, data) {
      commit('CHANGE_USER_ENTERING', data);
    },
  }
}
