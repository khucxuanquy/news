<template>
  <div id="messenger">
    <div class="header">
      <router-link to="/admin/dashboard">
        <i class="fas fa-angle-double-left"></i> <span>Trở về dashboard</span>
      </router-link>
      <div><span></span></div>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  created() {
    let info = JSON.parse(localStorage.getItem("_info"))
    if(info && (!info.hasOwnProperty('id') || !this.myAccount.hasOwnProperty('id'))) return this.$router.push('/admin/login').catch(()=>{});
  },
  computed: {
    ...mapGetters({
      myAccount: '_ACCOUNT/myAccount'
    })
  }
};
</script>

<style lang="scss">
#messenger {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  &>.header {
    width: 100%;
    height: 60px;
    border-bottom: thin solid #c7c1c1;

    display: flex;
    align-items: center;
    
    a {
      padding-left: .5em;
      font-size: 1.2em;
    }
  }
  .main {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 60px); // height header
  }
}
</style>