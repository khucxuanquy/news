export default {
    KEY_NAME: '_USERS',
    namespaced: true,
    state: {
        myAccount: {},
        users: []
    },
    getters: {
        users: state => state.users,
        myAccount: state => state.myAccount,
    },
    mutations: {
        CHANGE(state, users) {
            state.users = users;
        },
        CHANGE_MY_ACCOUNT(state, myAccount) {
            state.myAccount = myAccount;
        }
    },
    actions: {
        CHANGE({ commit }, users) {
            commit('CHANGE', users);
        },
        CHANGE_MY_ACCOUNT({ commit }, myAccount) {
            commit('CHANGE_MY_ACCOUNT', myAccount);
        }
    }
}
