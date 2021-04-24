export default {
  KEY_NAME: '_MESSAGE',
  namespaced: true,
  state: {
    conversations: [],
    boxMessages: []
  },
  getters: {
    conversations: state => state.conversations,
    boxMessages: state => {
      console.log(11, state.boxMessages)
      return state.boxMessages
    },
  },
  mutations: {
    CHANGE_CONVERSATIONS(state, conversations) {
      state.conversations = conversations
    },
    CHANGE_MESSAGES(state, boxMessages) {
      state.boxMessages = boxMessages;
    },
    CHAT_NEW_MESSAGE(state, data) {
      let { boxMessages } = state
      const lastBoxMessage = boxMessages[boxMessages.length - 1]

      if (lastBoxMessage && lastBoxMessage.sender_id === data.sender_id) {
        state.boxMessages[boxMessages.length - 1].messages.push({
          id: data.id,
          message: data.message,
          dateCreated: data.dateCreated
        })
      }
      else state.boxMessages.push({
        sender_id: data.sender_id,
        receive_id: data.receive_id,
        messages: [
          {
            id: data.id,
            message: data.message,
            dateCreated: data.dateCreated,
          },
        ],
      })

    }
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

  }
}
