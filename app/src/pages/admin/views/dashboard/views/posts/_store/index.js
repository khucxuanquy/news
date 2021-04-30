export default {
    KEY_NAME: '_POSTS',
    namespaced: true,
    state: {
        posts: [],
        totalPosts: 0
    },
    getters: {
        posts: state => state.posts,
        totalPosts: state => state.totalPosts,
    },
    mutations: {
        CHANGE(state, posts) {
            state.posts = posts;
        },
        CHANGE_TOTAL(state, totalPosts) {
            state.totalPosts = totalPosts;
        },
        CHANGE_ACTIVATED_POST(state, { id, activated }) {
            let index = state.posts.findIndex(post => post.id === id)
            if(index > -1) state.posts[index].activated = activated;
        },
    },
    actions: {
        CHANGE({ commit }, posts) {
            commit('CHANGE', posts);
        },
        CHANGE_TOTAL({ commit }, total) {
            commit('CHANGE_TOTAL', total);
        },
        CHANGE_ACTIVATED_POST({ commit }, data) {
            commit('CHANGE_ACTIVATED_POST', data);
        },
    }
}
