export default {
  KEY_NAME: '_POST_DETAIL',
  namespaced: true,
  state: {
    postsByCategory: [],
    highlightPost: []
  },
  getters: {
    postsByCategory: state => state.postsByCategory,
    highlightPost: state => state.highlightPost,
  },
  mutations: {
    CHANGE_POSTS_BY_CATEGORY(state, postsByCategory) {
      state.postsByCategory = postsByCategory;
    },
    CHANGE_HIGHLIGHT_POSTS(state, highlightPost) {
      state.highlightPost = highlightPost;
    }
  },
  actions: {
    CHANGE_POSTS_BY_CATEGORY({ commit }, postsByCategory) {
      commit('CHANGE_POSTS_BY_CATEGORY', postsByCategory);
    },
    CHANGE_HIGHLIGHT_POSTS({ commit }, highlightPost) {
      commit('CHANGE_HIGHLIGHT_POSTS', highlightPost);
    },
  }
}
