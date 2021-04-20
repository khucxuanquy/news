<template>
  <router-view />
</template>
<script>
export default {
  beforeCreate() {
    if (location.pathname == "/admin" || location.pathname == "/admin/") {
      this.$router.push("/admin/dashboard");
    }
  },
};
</script>
