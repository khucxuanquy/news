export default {
    KEY_NAME: '_CATEGORIES',
    namespaced: true,
    state: {
        categories: []
    },
    getters: {
        categories: state => state.categories,
    },
    mutations: {
        CHANGE(state, categories) {
            state.categories = categories;
        }
    },
    actions: {
        CHANGE({ commit }, categories) {
            commit('CHANGE', categories);
        }
    }
}
