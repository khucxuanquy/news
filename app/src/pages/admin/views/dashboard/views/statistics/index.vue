<template>
  <div id="statistics">
    <!-- <BoxChart typeChart="" /> -->
    <div style="width: 50vw">
      <BoxChart typeChart="line" />
    </div>
  </div>
</template>

<script>
import BoxChart from "components/box-chart";
export default {
  data() {
    return {};
  },
  components: {
    BoxChart,
  },
};
</script>

<style lang="scss">
#statistics {
  height: calc(100vh - 50px);
  overflow-y: auto;
}
</style>