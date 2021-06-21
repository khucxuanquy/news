<template>
  <div id="userManual-dashboard" v-loading.fullscreen.lock="isLoading">
    <p>Chưa có dữ liệu</p>
  </div>
</template>

<script>
import ENUM from "const/api";
import CONST from "const/const";
import { mapGetters } from "vuex";
const { REPORTS } = ENUM;
export default {
  data() {
    return {
      isLoading: false
    };
  },
  components: {},
  beforeCreate() {
    if (!localStorage.getItem("_u")) return this.$router.push("/admin/login");
  },
  created() {},
  methods: {},
  computed: {
    ...mapGetters({
      myAccount: "_HOMEPAGE/myAccount"
    })
  }
};
</script>

<style lang="scss" scoped>
#userManual-dashboard {
  padding: 1em;
}
</style>
