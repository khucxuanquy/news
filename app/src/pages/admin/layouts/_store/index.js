export default {
  KEY_NAME: '_ACCOUNT',
  namespaced: true,
  state: {
    myAccount: {},
    notification: {},
  },

  getters: {
    myAccount: state => state.myAccount,
    notification: state => state.notification,
  },

  mutations: {
    CHANGE_MY_ACCOUNT(state, myAccount) {
      state.myAccount = myAccount;
    },
    CHANGE_NOTIFICATION(state, data) {
      state.notification = data
    },
  },

  actions: {
    CHANGE_MY_ACCOUNT({ commit }, myAccount) {
      commit('CHANGE_MY_ACCOUNT', myAccount);
    },
    CHANGE_NOTIFICATION({ commit }, data) {
      commit('CHANGE_NOTIFICATION', data);
    },
  }
}
