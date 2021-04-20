<template>
    <div class="text-heading" :style="{ '--text-heading' : color }">
        <h2 class="title-border">
            <span class="title-bg">{{title}}</span>
        </h2>
    </div>
</template>

<script>
export default {
  data() {
    return { }
  },
   props: {
    color: {
      type: String,
      default: "#fc4a00"
    },
    title: {
      type: String
    },
  }
};
</script>
<style lang="scss" scoped>
$color : var(--text-heading);
.text-heading {
  margin-left: 1rem;
    
  .title-border {
    border-bottom: 2px solid $color;

      .title-bg {
        position: relative;
        background: $color;
        display: inline-block;
        padding: 0 25px;
        top: 2px;
        font-size: 16px;
        text-transform: uppercase;
        color: #fff;
        font-weight: 700;
        line-height: 36px;

        &::before,
        &::after {
          position: absolute;
          content: "";
          top: 0;
          height: 100%;
        } 
        &:before {
          left: -9px;
          width: 2px;
          bottom: 0;
          margin: auto;
          background: $color;
        }
        &:after {
          right: -15px;
          width: 0;
          height: 0;
          border-top: 35px solid transparent;
          border-bottom: 0 solid transparent;
          border-left: 15px solid $color;
        }
      }
    }
}
@media only screen and (max-width: 500px){
  .text-heading {
    margin-left: 0;

    .title-border {
      .title-bg {
        font-size: 1.2rem;
        padding: 0 1.5rem;
      }
    }
  }
}
</style>