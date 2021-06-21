<template>
  <div id="messenger" v-if="friends.length">
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
import { mapActions, mapGetters } from 'vuex';
export default {
  created() {
    let info = JSON.parse(localStorage.getItem("_info"))
    if(info && (!info.hasOwnProperty('id') || !this.myAccount.hasOwnProperty('id'))) return this.$router.push('/admin/login').catch(()=>{});

    if(!this.$route.params.id) {
      let checkUsers = setInterval(() => {
        if(this.friends.length) {
          // new change
          let id = this.friends.filter(i => this.myAccount.id !== i.id)[0].id
          this.$router.push(id)
          clearInterval(checkUsers)
        }
      }, 150);
    }

    if(!this.friends.length) {
      this.socket.on('CLIENT_FRIENDS', data => {
        this.CHANGE_FRIENDS(data)
        console.log(36, data.map(i => i.id))
      })
      this.socket.emit('GET_FRIENDS', {
        id: this.myAccount.id,
        permission: this.myAccount.permission,
        manager_id: this.myAccount.manager_id,
      })
    }
  },
  methods: {
    ...mapActions({
      CHANGE_FRIENDS: '_MESSAGE/CHANGE_FRIENDS',
    })
  },
  computed: {
    ...mapGetters({
      myAccount: '_ACCOUNT/myAccount',
      friends: '_MESSAGE/friends'
    })
  },
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