<template>
  <div class="commentBox">
    <div class="commentBox__avatar">
      <img
        :src="data.avatar || 'http://localhost:3000/static/images/avatar-default.jpg'"
        alt="image"
      />
    </div>
    <div class="commentBox__content">
      <div class="commentBox__text">
        <strong class="user_name">{{ data.fullName }}</strong>
        <span class="comment_text">{{ data.content }} </span>
      </div>
      <div class="commentBox__reaction">
        <i style="cursor: pointer" class="far fa-thumbs-up"></i>
        <span style="cursor: pointer" @click="onReply()">Trả lời</span>
        <span>5 day ago</span>
        <span style="cursor: pointer; color: blue; font-weight: bold: font-size: 24px" v-if="data.amount_child_comment">{{ data.amount_child_comment }} trả lời</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onReply() {
      this.$emit("showInput", this.data);
    }
  },
  props: {
    data: {
      type: Object,
      require: true
    }
  }
};
</script>

<style scoped>
.commentBox {
  width: 100%;
  max-width: 100%;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}
.commentBox__avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 10px;
}
.commentBox__content {
  padding: 10px;
  width: 100%;
}
.user_name {
  margin-right: 5px;
}
.commentBox__reaction {
  padding: 10px 0;
}
.commentBox__reaction > * {
  margin-right: 20px;
}
</style>
