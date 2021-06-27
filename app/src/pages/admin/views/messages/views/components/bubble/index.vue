<template>
  <div class="chat-bubbles">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>
<style lang="scss" scoped>
$size_bubble: 8px;
div.chat-bubbles {
  span {
    // background-color: #B6B5BA;
    display: inline-block;
    width: $size_bubble;
    height: $size_bubble;
    border-radius: 50%;
    margin-right: 5px;
    animation: bob 1.5s infinite;

    &:nth-child(1) {
      animation-delay: -1s;
    }
    &:nth-child(2) {
      animation-delay: -0.85s;
    }
    &:nth-child(3) {
      animation-delay: -0.7s;
      margin-right: 0;
    }

    @keyframes bob {
      10% {
        transform: translateY(-5px);
        background-color: #9e9da2;
      }
      50% {
        transform: translateY(0);
        background-color: #b6b5ba;
      }
    }
  }
}
</style>
