<template>
  <div>
    <CommentInput
      @changeValue="valueInputParent = $event"
      @submitComment="submitComment"
      :clearValue="clearValueParent"
      :keyId="'0'"
    />
      <el-divider></el-divider>
    <div
      v-if="Array.isArray(comments) && comments.length"
      class="comments-container"
    >
      <ul class="comments-list">
        <li v-for="(comment, indexParent) in comments" :key="comment.id">
          <div class="comment-main-level">
            <!-- Avatar -->
            <div class="comment-avatar">
              <img
                :src="
                  comment.avatar ||
                    'https://doan.khucblog.com/static/images/avatar-default.jpg'
                "
                alt=""
              />
            </div>
            <div class="comment-box">
              <div class="comment-head">
                <!-- display: flex -->
                <h6 class="comment-name by-author">
                  <i class="el-icon-user-solid" />
                  {{ comment.fullName }}</h6>
                <span class="posted-time">
                  <i class="el-icon-time"/>
                  {{ comment.dateCreated }}</span>
              </div>
              <div class="comment-content">
                {{ comment.content }}
                <div class="comment-open">
                  <span @click="changeReaction({ indexParent, comment })">
                    <i class="far fa-thumbs-up" /> {{comment.reaction}} Thích </span>
                  <span
                    class="total-reply"
                    @click="showTextareaChildWithId = comment.id"
                  ><i class="el-icon-chat-dot-square"/>Trả lời</span>
                </div>
              </div>
            </div>
          </div>
          <!-- form comment -->
          <!-- <transition name="fade"> -->
            <div class="areaInputComment" v-if="showTextareaChildWithId === comment.id">
              <CommentInput
                @changeValue="valueInputChild = $event"
                @submitComment="submitCommentChild"
                :clearValue="clearValueChild"
                :keyId="comment.id"
              />
            </div>
          <!-- </transition> -->

          <div
            class="quantity-reply"
            v-if="!comment.children.length && comment.amount_child_comment"
            @click="getCommentChild(comment)"
          >
            <i class="fas fa-reply" /> {{ comment.amount_child_comment }} Trả lời
          </div>
          <!-- list children -->
          <ul
            v-if="comment.children && comment.children.length"
            class="comments-list reply-list"
          >
            <li v-for="(item, indexChild) in comment.children" :key="item.id">
              <div class="comment-main-level">
                <!-- Avatar -->
                <div class="comment-avatar">
                  <img
                    style="width: 44px; height: 44px"
                    :src="item.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'" />
                </div>
                <div class="comment-box">
                  <div class="comment-head">
                    <!-- display: flex -->
                    <h6 class="comment-name by-author">{{ item.fullName }}</h6>
                    <span class="posted-time">{{ item.dateCreated }}</span>
                  </div>
                  <div class="comment-content">
                    {{ item.content }}
                    <div class="comment-open">
                      <span
                        @click="changeReaction({ indexParent, indexChild, comment })"
                      ><i class="far fa-thumbs-up" />{{item.reaction}} Thích</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <!-- view more -->
          <div v-if="comment.children && comment.children.length && comment.children.length < comment.amount_child_comment" style="text-align: center">
            <el-button type="primary" plain @click="getCommentChild(comment)">Xem thêm</el-button>
          </div>
        </li>
      </ul>
      <div v-if="!isMaxParentComment" style="text-align: center">
        <el-button type="primary" plain @click="getCommentParent()">Xem thêm</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import CommentInput from "./comment-input.vue";
import { mapActions, mapGetters } from "vuex";
import ENUM from "const/api";
const { COMMENTS } = ENUM;

export default {
  components: {
    CommentInput,
  },
  props: {
    postId: {
      type: String,
      require: true
    },
    // comments: {
    //   type: Array,
    //   require: true
    // },
    // isMaxParentComment: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      valueInputParent: "",
      valueInputChild: "",
      clearValueParent: false,
      clearValueChild: false,
      isMaxParentComment: false,
      showTextareaChildWithId: '',
      from: 0,
      limit: 10,
      comments: []
    }
  },
  methods: {
    getCommentParent() {
      if(this.isMaxParentComment || !this.postId) return;
      this.getAPI(
        COMMENTS.GET_COMMENTS,
        { post_id: this.postId, from: this.from, limit: this.limit },
        response => {
          const { ok, data } = response;
          if (!ok) return;

          // this.GET_COMMENTS(data);
          this.comments =[...this.comments, ...data.map(i=>({...i, children: []}))]
          // check max comment
          if (data.length < this.limit) this.isMaxParentComment = true;
          this.from += this.limit;
          // dispath action -> store
        }
      );
    },
    getCommentChild(comment){
      if(comment.children.length >= comment.amount_child_comment) return;
      this.getAPI(COMMENTS.GET_COMMENTS, { post_id: this.postId, from: comment.children.length, limit: this.limit, reply_id_comment: comment.id }, response => {
        let { ok, data } = response
        if(!ok) return;
        let index = this.comments.findIndex(i => i.id == comment.id)
        if(index > -1) {
          this.comments[index].children = [...this.comments[index].children,...data] 
        }
      })

    },
    changeReaction(dataInput){
      if(!this.userInfo.id) return this.$message({ type: 'warning', message: 'Vui lòng đăng nhập để tương tác' })
      let { indexParent, indexChild, comment } = dataInput
       // 1 : like, -1 dislike
      this.putAPI(COMMENTS.CHANGE_REACTION, {  comment_id: comment.id, reaction: 1 }, response => {
        let { ok } = response
        if(ok) {
          // cha
          if(typeof indexChild !== 'number') {
           return this.comments[indexParent].reaction += 1
          }
          this.comments[indexParent].children[indexChild].reaction += 1
        }
        
      })
    },
    submitComment() {
      let { valueInputParent } = this
      let post_id = this.postId
      if(!valueInputParent) return;
      // neu comment mới tinh
      this.postAPI(COMMENTS.CREATE_COMMENT, {  post_id, content: valueInputParent }, response => {
        let { ok, data } = response
        if(!ok) return;
        data.fullName = this.userInfo.fullName
        data.children = []
        this.comments.unshift(data);
      })
      this.clearValueParent = !this.clearValueParent;
    },
    submitCommentChild() {
      console.log(200, this.clearValueChild)
      if(!this.valueInputChild) return;
      let post_id = this.postId
      let idComment = this.showTextareaChildWithId
      this.postAPI(COMMENTS.CREATE_COMMENT, { post_id, content: this.valueInputChild, reply_id_comment: idComment }, response => {
        let { ok, data } = response
        if(!ok) return;
        let index = this.comments.findIndex(comment => comment.id === idComment);
        if (index >= 0) {
          this.comments[index].children.unshift(data);
        }
      })
      this.clearValueChild = !this.clearValueChild;
      console.log(220, this.clearValueChild)
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "_HOMEPAGE/userInfo",
    }),
  },
   watch: {
   "postId": function(e) {
     console.log(e)
      this.getCommentParent();
    }
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.areaInputComment {
  width: calc(100% - 0px);
  padding-left: 90px;
  margin: 15px 0 10px;
  img {
    width: 45px!important;
    height: 45px!important;
  }
}

.quantity-reply {
  display: inline-flex;
  align-items: center;
  padding: 15px 0px 15px 100px;
  font-size: medium;
  color: #008cffa6;

  &:hover {
    color: #008cff;
    cursor: pointer;
  }
  i {
    transform: rotate(180deg);
    margin-right: 1em;
  }
}

.comments-container {
  margin-top: 20px;
}

.comments-list {
  margin-top: 30px;
  position: relative;
}

.comments-list:before {
  content: "";
  width: 2px;
  height: 100%;
  background: #c7cacb;
  position: absolute;
  left: 32px;
  top: 0;
}

.comments-list:after {
  content: "";
  position: absolute;
  background: #c7cacb;
  bottom: 0;
  left: 27px;
  width: 7px;
  height: 7px;
  border: 3px solid #dee1e3;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.reply-list:before,
.reply-list:after {
  display: none;
}

.reply-list li:before {
  content: "";
  width: 60px;
  height: 2px;
  background: #c7cacb;
  position: absolute;
  top: 25px;
  left: -55px;
}

.comments-list li {
  margin-bottom: 15px;
  display: block;
  position: relative;
}

.comments-list li:after {
  content: "";
  display: block;
  clear: both;
  height: 0;
  width: 0;
}

.reply-list {
  padding-left: 88px;
  clear: both;
  margin-top: 15px;
}

.comments-list .comment-avatar {
  width: 65px;
  height: 65px;
  position: relative;
  float: left;
  border: 3px solid #fff;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.comments-list .comment-avatar img {
  width: 100%;
  height: 100%;
}

.reply-list .comment-avatar {
  width: 50px;
  height: 50px;
}

.comment-main-level:after {
  content: "";
  width: 0;
  height: 0;
  display: block;
  clear: both;
}

.comments-list .comment-box {
  // width: 680px;
  width: calc(100% - 100px);
  float: right;
  position: relative;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  background-color: #ccc;
}

.comments-list .comment-box:before,
.comments-list .comment-box:after {
  content: "";
  height: 0;
  width: 0;
  position: absolute;
  display: block;
  border-width: 10px 12px 10px 0;
  border-style: solid;
  border-color: transparent #ccc;
  top: 8px;
  left: -11px;
}

.comments-list .comment-box:before {
  border-width: 11px 13px 11px 0;
  border-color: transparent rgba(0, 0, 0, 0.05);
  left: -12px;
}

.comment-box .comment-head {
  // background: #cccccc;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e5e5;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
}

.comment-box .comment-name {
  color: #283035;
  font-size: 14px;
  font-weight: 700;
  float: left;
  margin:0 10px 0 0;
}


.comment-box .comment-head span {
  color: #999;
  font-size: 13px;
  position: relative;
}

.comment-box .comment-content {
  background: #cccccc;
  padding: 12px 0 0 12px;
  font-size: 15px;
  color: black;
  -webkit-border-radius: 0 0 0px 0px;
  -moz-border-radius: 0 0 0px 0px;
  border-radius: 0 0 0px 0px;
  border-bottom: 0.5px solid #e5e5e5;

  span {
    color: #595959;
  }
}

.comment-box .send-button,
.comment-box .comment-open {
  padding: 12px 0;
  // background: #cccccc none repeat scroll 0 0;
}

.comment-box .send-button .btn-send,
.comment-box .comment-open .btn-send {
  text-decoration: none;
}
.comment-open {
  span {
    margin-right: 1em;
    padding: 4px 8px;
    border-radius: 8px;
    user-select: none;

    &:hover {
      cursor: pointer;
      color: black;
      // text-shadow: 0 0 20px #000000a6;
      background: #eee;
    }
    &.total-reply {
      font-weight: 600;
    }

    i {
      margin-right: .2em;
    }
  }
}

.comment-box .btn-reply {
  cursor: pointer;
}

.comment-box .comment-name.by-author,
.comment-box .comment-name.by-author a {
  color: #03658c;
}

.comment-box .comment-name.by-author:after {
  /*content: '';*/
  background: #03658c;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  font-weight: 700;
  margin-left: 10px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}

@media only screen and (max-width: 766px) {
  .comments-container {
    width: 480px;
  }

  .comments-list .comment-box {
    width: 390px;
  }

  .reply-list .comment-box {
    width: 320px;
  }
}
</style>
