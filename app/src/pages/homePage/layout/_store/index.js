export default {
    KEY_NAME: '_HOMEPAGE',
    namespaced: true,
    state: {
        home: {
            topNewFeed: [],
            topPostsOfWeek: [],
            topPostsOfMonth: [],
            trendingInWeek: [],
            sectionBottom: {},
        },
        userInfo: {},
        userInfoDetail: {},
        responsive: {
            isDesktop: true,
            isTablet: false,
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
            if(Array.isArray(home.topNewFeed) && home.topNewFeed.length) state.home.topNewFeed = home.topNewFeed
            if(Array.isArray(home.topPostsOfWeek) && home.topPostsOfWeek.length) state.home.topPostsOfWeek = home.topPostsOfWeek
            if(Array.isArray(home.topPostsOfMonth) && home.topPostsOfMonth.length) state.home.topPostsOfMonth = home.topPostsOfMonth
            if(home.sectionBottom && Object.entries(home.sectionBottom).length) state.home.sectionBottom = home.sectionBottom
            if(Array.isArray(home.trendingInWeek) && home.trendingInWeek.length) state.home.trendingInWeek = home.trendingInWeek
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
