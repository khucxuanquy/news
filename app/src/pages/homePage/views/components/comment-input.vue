<template>
  <div class="wrap-comment-input">
    <div class="avatar">
      <img src="http://localhost:3000/static/images/avatar-default.jpg" />
    </div>
      <el-input
        :class="'inputComment-' + keyId"
        type="textarea"
        placeholder="Nhập bình luận ..."
        v-model="val"
        maxlength="1000"
        style="width: calc(100% - 65px); margin: 0 15px;"
      >
      </el-input>
      <el-button style="max-height: 40px" type="primary" plain @click="submitComment()">Gửi</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val: ""
    };
  },
  props: {
    clearValue: {
      type: Boolean,
      default() {
        return false;
      }
    },
    keyId: {
      type: String,
      require: true
    }
  },
  methods: {
    submitComment() {
      this.$emit("submitComment", true);
    }
  },
  watch: {
    val(e) {
      this.$emit("changeValue", e);
    },
    clearValue() {
      setTimeout(() => {
        document.querySelector(`.inputComment-${this.keyId} textarea`).value = ''
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.wrap-comment-input {
  display: flex;
  width: 100%;

  .avatar img {
    border-radius: 10%;
    box-shadow: 0 1px 2px #00000033;
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  textarea {
    min-width: 50px;
    max-height: 300px!important;
  }
}

</style>
