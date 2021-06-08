import ENUM from "const/api";
const { COMMENTS } = ENUM;
export default {
  KEY_NAME: "_POST_DETAIL",
  namespaced: true,
  state: {
    postsByCategory: [],
    highlightPost: [],
    comments: [],
    /*
    id: ""
    fullName: ""
    avatar: ""
    content: ""
    reaction: 0
    dateCreated: ""
    amount_child_comment: 1
    childrenComments: [
      avatar: ""
      content: ""
      dateCreated: ""
      fullName: ""
      id: ""
      reaction: 0
      reply_id_comment: "
    ]
    */
  },
  getters: {
    postsByCategory: (state) => state.postsByCategory,
    highlightPost: (state) => state.highlightPost,
    comments: (state) => state.comments,
  },
  mutations: {
    CHANGE_POSTS_BY_CATEGORY(state, postsByCategory) {
      state.postsByCategory = postsByCategory;
    },
    CHANGE_HIGHLIGHT_POSTS(state, highlightPost) {
      state.highlightPost = highlightPost;
    },
    GET_COMMENTS(state, comments) {
      state.comments = comments;
      
    },
    GET_COMMENTS_CHILD(state,datas){
      state.comments[datas.index].childrenComments= datas.data
      console.log(state.comments);
    }
  },
  actions: {
    CHANGE_POSTS_BY_CATEGORY({ commit }, postsByCategory) {
      commit("CHANGE_POSTS_BY_CATEGORY", postsByCategory);
    },
    CHANGE_HIGHLIGHT_POSTS({ commit }, highlightPost) {
      commit("CHANGE_HIGHLIGHT_POSTS", highlightPost);
    },
    GET_COMMENTS({ commit }, comments) {
      commit("GET_COMMENTS", comments);
    },
    GET_COMMENTS_CHILD({ commit }, datas) {
      commit("GET_COMMENTS_CHILD", datas);
    },
  },
};
