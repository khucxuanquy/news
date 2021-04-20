export default {
  KEY_NAME: '_ACCOUNT',
  namespaced: true,
  state: {
    myAccount: {},
  },

  getters: {
    myAccount: state => state.myAccount,
  },

  mutations: {
    CHANGE_MY_ACCOUNT(state, myAccount) {
      state.myAccount = myAccount;
    }
  },

  actions: {
    CHANGE_MY_ACCOUNT({ commit }, myAccount) {
      commit('CHANGE_MY_ACCOUNT', myAccount);
    },
  }
}
