export default {
    KEY_NAME: '_STATISTICS',
    namespaced: true,
    state: {
        overview: {
            quantityInDate: null,
            quantityInMonth: null,
            quantityInWeek: null,
            topEmployeesInWeek: [],
            topEmployeesInMonth: [],
        },
        categoryMostInterest: null,
        statisticCategories: null,
        viewsByDatePicker: null
    },
    getters: {
        overview: state => state.overview,
        categoryMostInterest: state => state.categoryMostInterest,
        viewsByDatePicker: state => state.viewsByDatePicker,
        statisticCategories: state => state.statisticCategories,
    },
    mutations: {
        CHANGE_OVERVIEW(state, overview) {
            state.overview = overview;
        },
        CHANGE_CATEGORY_MOST_INTEREST(state, categoryMostInterest) {
            state.categoryMostInterest = categoryMostInterest;
        },
        CHANGE_VIEWS_BY_DATE_PICKER(state, viewsByDatePicker) {
            state.viewsByDatePicker = viewsByDatePicker;
        },
        CHANGE_STATISTIC_CATEGORIES(state, statisticCategories) {
            state.statisticCategories = statisticCategories;
        },
    },
    actions: {
        CHANGE_OVERVIEW({ commit }, overview) {
            commit('CHANGE_OVERVIEW', overview);
        },
        CHANGE_CATEGORY_MOST_INTEREST({ commit }, categoryMostInterest) {
            commit('CHANGE_CATEGORY_MOST_INTEREST', categoryMostInterest);
        },
        CHANGE_VIEWS_BY_DATE_PICKER({ commit }, viewsByDatePicker) {
            commit('CHANGE_VIEWS_BY_DATE_PICKER', viewsByDatePicker);
        },
        CHANGE_STATISTIC_CATEGORIES({ commit }, statisticCategories) {
            commit('CHANGE_STATISTIC_CATEGORIES', statisticCategories);
        },
    }
}