export default {
  KEY_NAME: '_MESSAGE',
  namespaced: true,
  state: {
    conversations: [],
    boxMessages: [],
    friends: [],
    idsFriendsOnline: []
  },
  getters: {
    conversations: state => state.conversations,
    boxMessages: state => state.boxMessages,
    idsFriendsOnline: state => state.idsFriendsOnline,
    friends: state => {
      if (!state.idsFriendsOnline.length) return state.friends
      return state.friends.map(i => ({ ...i, status: state.idsFriendsOnline.includes(i.id) ? 'online' : '' }))
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
          content: data.content,
          dateCreated: data.dateCreated
        })
      }
      else state.boxMessages.push({
        sender_id: data.sender_id,
        receive_id: data.receive_id,
        messages: [
          {
            id: data.id,
            content: data.content,
            dateCreated: data.dateCreated,
          },
        ],
      })

    },
    CHANGE_FRIENDS(state, friends) {
      state.friends = friends;
    },
    CHANGE_FRIENDS_ONLINE(state, idsFriendsOnline) {
      state.idsFriendsOnline = idsFriendsOnline;
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
    CHANGE_FRIENDS({ commit }, friends) {
      commit('CHANGE_FRIENDS', friends);
    },
    CHANGE_FRIENDS_ONLINE({ commit }, idsFriendsOnline) {
      commit('CHANGE_FRIENDS_ONLINE', idsFriendsOnline);
    }
  }
}
