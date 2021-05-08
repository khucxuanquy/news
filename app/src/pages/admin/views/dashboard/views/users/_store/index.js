export default {
    KEY_NAME: '_USERS',
    namespaced: true,
    state: {
        users: [],
    },
    getters: {
        users: state => state.users,
    },
    mutations: {
        CHANGE(state, users) {
            state.users = users;
        },
    },
    actions: {
        CHANGE({ commit }, users) {
            commit('CHANGE', users);
        },
    }
}
