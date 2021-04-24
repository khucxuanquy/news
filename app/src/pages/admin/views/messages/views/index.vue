<template>
  <div class="flex-layout">
    <Conversations />
    <BoxChat />
  </div>
</template>

<script>
import BoxChat from "./boxChat";
import Conversations from "./conversations";
export default {
  components: {
    BoxChat,
    Conversations,
  },
};
</script>

<style lang="scss">
.flex-layout {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
</style>