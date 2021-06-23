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
        userInfoDetail: {},
        responsive: {
            isDesktop: true
        },
        // statistics
        statisticOverview: {},
        statisticHistoryComment: []
    },
    getters: {
        home: state => state.home,
        responsive: state => state.responsive,
        userInfo: state => state.userInfo,
        userInfoDetail: state => state.userInfoDetail,
        statisticOverview: state => state.statisticOverview,
        statisticHistoryComment: state => state.statisticHistoryComment,
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
        },
        CHANGE_USER_INFO_DETAIL(state, data) {
            state.userInfoDetail = data;
        },
        CHANGE_STATISTIC_OVERVIEW(state, data) {
            state.statisticOverview = data;
        },
        CHANGE_STATISTIC_HISTORY_COMMENT(state, data) {
            state.statisticHistoryComment = data;
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
        CHANGE_USER_INFO_DETAIL({ commit }, data) {
            commit('CHANGE_USER_INFO_DETAIL', data);
        },
        CHANGE_STATISTIC_OVERVIEW({ commit }, data) {
            commit('CHANGE_STATISTIC_OVERVIEW', data);
        },
        CHANGE_STATISTIC_HISTORY_COMMENT({ commit }, data) {
            commit('CHANGE_STATISTIC_HISTORY_COMMENT', data);
        },
    }
}
