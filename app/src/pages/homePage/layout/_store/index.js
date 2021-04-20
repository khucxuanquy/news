export default {
    KEY_NAME: '_HOMEPAGE',
    namespaced: true,
    state: {
        home: {
            hotTopics: [],
            topNewFeed: [],
            topPostsOfWeek: [],
            topPostsOfMonth: [],
            sectionBottom: {},
        },
        userInfo: {},
        responsive: {
            isDesktop: true
        }
    },
    getters: {
        home: state => state.home,
        responsive: state => state.responsive,
        userInfo: state => state.userInfo,
    },
    mutations: {
        CHANGE_DATA_HOME(state, home) {
            state.home = home;
        },
        CHANGE_RESPONSIVE(state, data) {
            state.responsive.isDesktop = data;
        },
        CHANGE_USER_INFO(state, data) {
            state.userInfo = data;
        }
    },
    actions: {
        CHANGE_DATA_HOME({ commit }, home) {
            commit('CHANGE_DATA_HOME', home);
        },
        CHANGE_RESPONSIVE({ commit }, data) {
            commit('CHANGE_RESPONSIVE', data);
        },
        CHANGE_USER_INFO({ commit }, data) {
            commit('CHANGE_USER_INFO', data);
        },
        
    }
}
