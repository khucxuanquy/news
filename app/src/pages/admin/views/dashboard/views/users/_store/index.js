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
        TRANSFER_USERS(state, dataInput) {
            let { manager_id, idsUserTransferred } = dataInput
            for (const i in state.users) {
                if (idsUserTransferred.includes(state.users[i].id)) state.users[i].manager_id = manager_id
            }
        },

    },
    actions: {
        CHANGE({ commit }, users) {
            commit('CHANGE', users);
        },
        TRANSFER_USERS({ commit }, dataInput) {
            commit('TRANSFER_USERS', dataInput);
        },
    }
}
