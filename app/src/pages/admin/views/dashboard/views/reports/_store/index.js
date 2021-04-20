export default {
    KEY_NAME: '_REPORTS',
    namespaced: true,
    state: {
        reports: []
    },
    getters: {
        reports: state => state.reports,
    },
    mutations: {
        CHANGE(state, reports) {
            state.reports = reports;
        }
    },
    actions: {
        CHANGE({ commit }, reports) {
            commit('CHANGE', reports);
        }
    }
}
