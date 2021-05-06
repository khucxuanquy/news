import STORE from './index'
export default async function () {
    return await new Promise(resolve => {
        Promise.all([
            import('../lang/_store'),
            import('../pages/admin/layouts/_store'),
            import('../pages/admin/views/messages/views/_store'),
            import('../pages/admin/views/dashboard/views/categories/_store'),
            import('../pages/admin/views/dashboard/views/posts/_store'),
            import('../pages/admin/views/dashboard/views/users/_store'),
            import('../pages/admin/views/dashboard/views/reports/_store'),
            import('../pages/admin/views/dashboard/views/statistics/_store'),
            import('../pages/homePage/layout/_store'),
            import('../pages/homePage/views/_store'),
        ]).then(data => {
            data.forEach(store => {
                STORE.registerModule(store.default.KEY_NAME, store.default)
            })
            resolve()
        });
    })
}
