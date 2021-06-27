<template>
  <div id="messenger" v-if="conversations.length">
    <div class="header">
      <router-link to="/admin/dashboard">
        <i class="fas fa-angle-double-left"></i> <span>Trở về dashboard</span>
      </router-link>
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

    // nếu không vào conversation nào => vào conversation đầu tiên
    if(!this.$route.params.id) {
      let checkUsers = setInterval(() => {
        if(this.conversations.length) {
          // new change
          let id = this.conversations.filter(i => this.myAccount.id !== i.id)[0].id
          this.$router.push(id)
          clearInterval(checkUsers)
        }
      }, 150);
    }

    if(!this.conversations.length) {
      this.socket.on('SERVER_SEND_CONVERSATIONS', data => {
        this.CHANGE_CONVERSATIONS(data)
      })
      // nên để token mới đúng => an toàn hơn
      this.socket.emit('CLIENT_GET_CONVERSATIONS', {
        id: this.myAccount.id,
        permission: this.myAccount.permission,
        manager_id: this.myAccount.manager_id,
      })
    }
  },
  methods: {
    ...mapActions({
      CHANGE_CONVERSATIONS: '_MESSAGE/CHANGE_CONVERSATIONS',
    })
  },
  computed: {
    ...mapGetters({
      myAccount: '_ACCOUNT/myAccount',
      conversations: '_MESSAGE/conversations'
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