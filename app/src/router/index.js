import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const ALL_ROUTER = [
    // home
    {
        path: '/',
        component: () => import('../pages/homePage/layout'),
        hidden: true,
        children: [
            {
                path: '/',
                component: () => import('../pages/homePage/views/index.vue'),
                meta: {
                    title: 'Trang Chủ'
                }
            },
            {
                path: 'post/:category_url/:post_url',
                component: () => import('../pages/homePage/views/postDetail.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: 'category/',
                component: () => import('../pages/homePage/views/category.vue'),
                meta: {
                    title: 'Chủ đề'
                }
            },
            {
                path: 'category/:category_url/',
                component: () => import('../pages/homePage/views/category.vue'),
                meta: {
                    title: 'Chủ đề'
                }
            },
            {
                path: 'search',
                component: () => import('../pages/homePage/views/search.vue'),
                meta: {
                    title: 'Tìm kiếm'
                }
            }
        ]
    },
    // home login
    {
        path: '/home',
        hidden: true,
        children: [
            {
                path: '/login',
                component: () => import('../pages/login/homepage/login.vue'),
                meta: {
                    title: 'Đăng nhập'
                }
            },
            {
                path: '/register',
                component: () => import('../pages/login/homepage/register.vue'),
                meta: {
                    title: 'Đăng kí'
                }
            },
            {
                path: '/forgotPassword',
                component: () => import('../pages/login/homepage/forgotPassword.vue'),
                meta: {
                    title: 'Lấy lại mật khẩu'
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
                    title: 'Quản lí Note Pro'
                },
                children: [
                    {
                        path: 'posts',
                        component: () => import('../pages/admin/views/dashboard/views/posts/index.vue'),
                        meta: {
                            title: 'Quản lí bài viết | Note Pro'
                        }
                    },
                    {
                        path: 'categories',
                        component: () => import('../pages/admin/views/dashboard/views/categories'),
                        meta: {
                            title: 'Quản lí Chủ đề | Note Pro'
                        }
                    },
                    {
                        path: 'reports',
                        component: () => import('../pages/admin/views/dashboard/views/reports'),
                        meta: {
                            title: 'Quản lí báo cáo | Note Pro'
                        }
                    },
                    {
                        path: 'users',
                        component: () => import('../pages/admin/views/dashboard/views/users'),
                        meta: {
                            title: 'Quản lí Người dùng | Note Pro'
                        }
                    },
                ]
            },
            // messenger
            {
                path: 'messages',
                component: () => import('../pages/admin/views/messages/layouts'),
                meta: {
                    title: 'Messenger | News'
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
                    title: 'Đăng nhập vào trang quản lí'
                }
            },
        ]
    },
    // 404 not found
    {
        path: '*',
        component: () => import('../pages/notfound/layout/index.vue'),
        hidden: true,
    },
];
var router = new Router({
    mode: 'history', // import service support
    scrollBehavior: () => ({ y: 0 }),
    routes: ALL_ROUTER,
});

export default router;
