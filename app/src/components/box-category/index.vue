<template>
  <div class="box-category flex-center" :style="`background: ${data.color}`" @click="redirect(data.url)">
    <span class="title">{{ data.name }}</span>
    <span class="quantity flex-center">{{ data.total_posts }}</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    redirect(url){
      if(!url) return;
      this.$router.push('/category/' + url)
    }
  },
};
</script>
<style lang="scss">
.box-category {
  position: relative;
  padding: 0 20px;
  min-height: 65px;
  border-radius: 6px;
  margin-bottom: 8px;
  overflow: hidden;
  justify-content: space-between;
  cursor: pointer;
  background-position: 50% center;
  background-size: cover;
  margin-left: 1rem;
  width: calc(100% - 1rem );
  .title {
    color: #f7f7f7;
    position: relative;
    z-index: 1;
    text-shadow: 0 0 10px #888888;
    font-weight: bold;
  }
  .quantity {
    color: black;
    z-index: 1;
    box-shadow: 0 0 10px #888888;
    background: #f7f7f7;
    border-radius: 4px;
    width: 30px;
    height: 25px;
  }
  &::after {
    position: absolute;
    content: "";
    // background: #00000080;
    background: transparent;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    transition: all 0.2s ease-out;
  }
  &:hover {
    &::after {
    background: #00000080;
    // background: transparent;
    }
  }
}

@media only screen and (max-width: 500px){
  .box-category {
    margin-left: 0;
    width: 100%;
  }
}
</style>