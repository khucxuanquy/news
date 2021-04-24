export default {
    KEY_NAME: '_USERS',
    namespaced: true,
    state: {
        myAccount: {},
        users: [],
        idsUsersOnline: []
    },
    getters: {
        users: state => {
            if (!state.idsUsersOnline.length) return state.users
            return state.users.map(i => ({ ...i, status: state.idsUsersOnline.includes(i.id) ? 'online' : '' }))
        },
        myAccount: state => state.myAccount,
    },
    mutations: {
        CHANGE(state, users) {
            state.users = users;
        },
        CHANGE_MY_ACCOUNT(state, myAccount) {
            state.myAccount = myAccount;
        },
        CHANGE_USERS_ONLINE(state, idsUsersOnline) {
            state.idsUsersOnline = idsUsersOnline
        }
    },
    actions: {
        CHANGE({ commit }, users) {
            commit('CHANGE', users);
        },
        CHANGE_MY_ACCOUNT({ commit }, myAccount) {
            commit('CHANGE_MY_ACCOUNT', myAccount);
        },
        CHANGE_USERS_ONLINE({ commit }, usersOnline) {
            commit('CHANGE_USERS_ONLINE', usersOnline);
        }
    }
}
