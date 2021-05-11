require('dotenv').config()
const URL = 'http://localhost:3000/API/'
export default {
    MEDIA : 'https://cdn.laptrinhmaytinh.com/',
    POSTS: {
        CREATE: URL + 'posts/create',
        EDIT: URL + 'posts/edit',
        DELETE: URL + 'posts/delete',
        GET: URL + 'posts/get',
        GET_POSTS_BY_PERMISSION: URL + 'posts/getPostsByPermission',
        HOME: URL + 'posts/home',
        GET_CONTENT: URL + 'posts/getContent',
        GET_POSTS_BY_CATEGORY: URL + 'posts/getPostsByCategory',
        SEARCH: URL + 'posts/search',
        SEARCH_BY_PERMISSION: URL + 'posts/searchByPermission',
        GET_OVERVIEW_STATISTICS: URL + 'posts/overviewStatistic'
    },
    CATEGORIES: {
        CREATE: URL + 'categories/create',
        EDIT: URL + 'categories/edit',
        DELETE: URL + 'categories/delete',
        GET: URL + 'categories/get',
        GET_ALL: URL + 'categories/getAllCategories',
        GET_CATEGORIES_IN_DASHBOARD: URL + 'categories/getCategoriesInDashboard',
    },
    REPORTS: {
        CREATE: URL + 'reports/create',
        EDIT: URL + 'reports/edit',
        DELETE: URL + 'reports/delete',
        GET: URL + 'reports/get',
        GET_REPORTS: URL + 'reports/getReports',
    },
    USERS: {
        CREATE: URL + 'users/create',
        EDIT: URL + 'users/edit',
        DELETE: URL + 'users/delete',
        GET: URL + 'users/get',
        LOGIN: URL + 'users/login',
        LOGOUT: URL + 'users/logout',
        CHECK_LOGIN : URL + 'users/checkLogin',
        GET_ALL: URL + 'users/getUsersByPermission',
        GET_INFO_USER: URL + 'users/getInfoUser',
        
        REGISTER: URL + 'users/register',
        FORGOT_PASSWORD: URL + 'users/forgotPassword',
        VERIFY_FORGOT_PASSWORD: URL + 'users/verifyForgotPassword',
        CHANGE_PASSWORD: URL + 'users/changePassword',
    },
    STATISTICS: {
        GET: URL + 'statistics/getStatistics',
        GET_BY_DATE_PICKER: URL + 'statistics/getByDatePicker'
    }
}