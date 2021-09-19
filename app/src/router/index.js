import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const ALL_ROUTER = [
    // home
    {
        path: '/',
        component: () => import(/* webpackChunkName: "routes/layout" */ '../pages/homePage/layout'),
        hidden: true,
        children: [
            {
                path: '/',
                component: () => import('../pages/homePage/views/index.vue'),
                meta: {
                    title: 'Trang Chủ | Tech News'
                }
            },
            {
                path: 'post/:category_url/:post_url',
                component: () => import( /* webpackChunkName: "postDetail" */ '../pages/homePage/views/postDetail.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'category/',
                component: () => import('../pages/homePage/views/category.vue'),
                meta: {
                    title: 'Chủ đề | Tech News'
                }
            },
            {
                path: 'category/:category_url/',
                component: () => import('../pages/homePage/views/category.vue'),
                meta: {
                    title: 'Chủ đề | Tech News'
                }
            },
            {
                path: 'search',
                component: () => import('../pages/homePage/views/search.vue'),
                meta: {
                    title: 'Tìm kiếm | Tech News'
                }
            }
        ]
    },
    // home login
    {
        path: '/home',
        component: () => import('../pages/login/homepage/layout'),
        hidden: true,
        children: [
            {
                path: 'login',
                component: () => import('../pages/login/homepage/login.vue'),
                meta: {
                    title: 'Đăng nhập | Tech News'
                }
            },
            {
                path: 'register',
                component: () => import('../pages/login/homepage/register.vue'),
                meta: {
                    title: 'Đăng kí | Tech News'
                }
            },
            {
                path: 'forgotPassword',
                component: () => import('../pages/login/homepage/forgotPassword.vue'),
                meta: {
                    title: 'Lấy lại mật khẩu | Tech News'
                }
            },
            {
                path: 'resetPassword/:token',
                component: () => import('../pages/login/homepage/resetPassword.vue'),
                meta: {
                    title: 'Tạo mật khẩu mới | Tech News'
                }
            },
        ]
    },
    // admin
    {
        path: '/admin',
        component: () => import('../pages/admin/layouts/index.vue'),
        // hidden: true,
        children: [
            // dashboard
            {
                path: 'dashboard',
                component: () => import('../pages/admin/views/dashboard/layout/layout.vue'),
                meta: {
                    title: 'Quản lí | Tech News'
                },
                children: [
                    {
                        path: 'posts',
                        component: () => import('../pages/admin/views/dashboard/views/posts/index.vue'),
                        meta: {
                            title: 'Quản lí bài viết | Tech News'
                        }
                    },
                    {
                        path: 'categories',
                        component: () => import('../pages/admin/views/dashboard/views/categories'),
                        meta: {
                            title: 'Quản lí Chủ đề | Tech News'
                        }
                    },
                    {
                        path: 'reports',
                        component: () => import('../pages/admin/views/dashboard/views/reports'),
                        meta: {
                            title: 'Quản lí báo cáo | Tech News'
                        }
                    },
                    {
                        path: 'users',
                        component: () => import('../pages/admin/views/dashboard/views/users'),
                        meta: {
                            title: 'Quản lí Người dùng | Tech News'
                        }
                    },
                    {
                        path: 'statistics',
                        component: () => import('../pages/admin/views/dashboard/views/statistics'),
                        meta: {
                            title: 'Thống kê | Tech News'
                        }
                    },
                    {
                        path: 'userManual',
                        component: () => import('../pages/admin/views/dashboard/views/userManual'),
                        meta: {
                            title: 'Hướng dẫn sử dụng | Tech News'
                        }
                    },
                ]
            },
            // messenger
            {
                path: 'messages',
                component: () => import('../pages/admin/views/messages/layouts'),
                meta: {
                    title: 'Messenger | Tech News'
                },
                children: [
                    {
                        path: ':id',
                        component: () => import('../pages/admin/views/messages/views'),
                        meta: {
                            title: 'Messenger'
                        }
                    },
                ]
            },
            // login admin
            {
                path: 'login',
                component: () => import('../pages/login/dashboard/index.vue'),
                meta: {
                    title: 'Đăng nhập vào trang quản lí | Tech News'
                }
            },
        ]
    },
    {
        path: '/test',
        component: () => import(/* webpackChunkName: "test" */ '../pages/test/index.vue'),
    },
    // 404 not found
    {
        path: '*',
        component: () => import('../pages/notfound/layout/index.vue'),
        hidden: true,
        meta: {
            title: 'Page Not Found | Tech News'
        }
    },
];
var router = new Router({
    mode: 'history', // import service support
    scrollBehavior: () => ({ y: 0 }),
    routes: ALL_ROUTER,
});

export default router;
