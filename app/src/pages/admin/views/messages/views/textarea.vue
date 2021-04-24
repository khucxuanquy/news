<template>
  <div>
    <textarea v-model="content" @input="test" placeholder="hihi"></textarea>
    <div class="hiddenDiv"><br style="line-height: 10px" /> {{content}} </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      content: ''
    }
  },
  props: {
    value: {
      type: String,
    },
  },
  methods: {
    test(e) {
      const { nextElementSibling, style } =  e.target
      style.height = nextElementSibling.offsetHeight + "px";
    }
  },
};
</script>
<style lang="scss" scope>
textarea {
  color: #444;
  max-width: 100%;
  width: 100%;
  min-height: 50px;
  padding: 10px 5px;
  overflow: hidden;
  border: none;
  outline: none;
}
.hiddenDiv {
  word-break: break-word;
  visibility: hidden;
  position: absolute;
  z-index: -9999;
  width: 100%;
}
</style>