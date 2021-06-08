<template>
  <div class="comment__input showInput">
    <div class="avatar">
      <img
        src="https://i.kym-cdn.com/photos/images/masonry/001/832/404/fb6.jpg"
        alt="image"
      />
    </div>
    <div class="textareaBox__content">
      <textarea
        placeholder="Nhập ở đây...."
        v-model="val"
        @keypress.enter="submitComment()"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val: "",
    };
  },
  mounted() {
    var textarea = document.querySelector("textarea");
    textarea.addEventListener("keydown", autosize);
    function autosize() {
      var el = this;
      setTimeout(function () {
        el.style.cssText = "height:auto; padding:0";
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = "height:" + el.scrollHeight + "px";
      }, 0);
    }
  },
  methods: {
    submitComment() {
      this.$emit("submitComment", true);
    },
  },
  watch: {
    val(e) {
      this.$emit("changeValue", e);
    },
  },
  computed: {},
};
</script>

<style scoped>
.comment__input {
  display: flex;
  width: 100%;
  max-width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 10px;
}
.textareaBox__content {
  width: 100%;
  padding: 10px;
}
textarea {
  width: 100%;
  resize: none;
  overflow: hidden;
  border: none;
  border-bottom: thin solid gray;
  outline: none;
  padding: 3px 0 0 13px;
  border-radius: 8px;
  color: #333;
}
</style>