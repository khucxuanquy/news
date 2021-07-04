<template>
  <div class="mask"  @click="fakeSound()">
    <router-view  />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import ENUM from "const/api";
const { USERS } = ENUM;

export default {
  data() {
    return {
      notCheck: false
    }
  },
  beforeCreate() {
    if (location.pathname == "/admin" || location.pathname == "/admin/") {
      this.$router.push("/admin/dashboard");
    }
  },
  methods: {
    ...mapActions({
      CHANGE_MY_ACCOUNT: "_ACCOUNT/CHANGE_MY_ACCOUNT",
      CHANGE_NOTIFICATION: "_ACCOUNT/CHANGE_NOTIFICATION",
      CHANGE_USERS: "_USERS/CHANGE",
    }),
    playSoundNotice(isMuted){
      let audio = document.querySelector("body>audio")
      audio.muted = isMuted ? true : false
      audio.play()
    },
    fakeSound() {
      if(this.notCheck) return;
      let audio = new Audio('https://doan.khucblog.com/static/media/sound_notice.mp3')
      audio.muted = true
      audio.play()
      this.notCheck = true
    },
  },
  computed: {
    ...mapGetters({
      idsUserOnline: "_MESSAGE/idsUserOnline",
      myAccount: "_ACCOUNT/myAccount",
    }),
  },
  created() {
    let info = localStorage.getItem("_info");
    if (!info) return this.$router.push("/admin/login").catch(() => {});
    info = JSON.parse(info);
    this.CHANGE_MY_ACCOUNT(info);

    if (info.permission >= 2) {
      this.getAPI(USERS.GET_ALL, {}, (res) => {
        const { ok, data } = res;
        if (!ok)
          return this.$message({ type: "Error", message: "something error" });
        this.CHANGE_USERS(data);
      });
    }
    let checkUsers = setInterval(() => {
      if (!this.idsUserOnline.length) {
        // gọi 1 lần duy nhất
        this.socket.emit("CLIENT_GET_CONVERSATIONS_ONLINE");
        clearInterval(checkUsers);
      }
    }, 1000);
    this.socket.on("SERVER_SEND_NOTIFICATION", (data, playSound) => {
      this.CHANGE_NOTIFICATION(data)
      if(playSound) {
        new Audio('https://doan.khucblog.com/static/media/sound_notice.mp3').play();
        this.$notify({
          title: 'Bạn có tin nhắn mới',
          // message: JSON.stringify(data),
          duration: 2000,
          type: "success"
        });
      }
    })
    this.socket.emit("CLIENT_GET_NOTICE", { myAccountId: this.myAccount.id })
  },
  beforeDestroy() {
    this.socket.removeListener("SERVER_SEND_NOTIFICATION")
  },
};
</script>
