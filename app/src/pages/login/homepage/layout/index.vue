<template>
<div v-if="visible" class="wrapper-form-login">
  <router-view />
</div>
</template>
<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  created() {
    if(!localStorage.getItem('_u')) return this.visible = true
    location.pathname = ''
  },
}
</script>
<style lang="scss" scope>
.wrapper-form-login {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to left, #76b852, #8DC26F);
}
  
</style>