<template>
  <router-view />
</template>
<script>
import { mapActions } from "vuex";
import ENUM from "const/api";
const { USERS } = ENUM;

export default {
  beforeCreate() {
    if (location.pathname == "/admin" || location.pathname == "/admin/") {
      this.$router.push("/admin/dashboard");
    }
  },
  methods: {
    ...mapActions({
      CHANGE_MY_ACCOUNT: "_ACCOUNT/CHANGE_MY_ACCOUNT",
      CHANGE_USERS: "_USERS/CHANGE",
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
  },
};
</script>
