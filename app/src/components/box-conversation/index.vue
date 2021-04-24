<template>
  <div class="box-conversation">
    <div class="avatar">
      <img :src="DATA.avatar || 'https://news.laptrinhmaytinh.com/static/images/logo.png'" alt="avatar" v-once/>
      <span class="dot-status" :style="{'background': `${DATA.status == 'online' ? '#42d340' : 'transparent'}`}"></span>
    </div>
    <div class="meta">
      <span class="name" v-once>{{DATA.fullName}}</span>
      <div class="description">
        <span class="last-text">{{DATA.text}}</span>
        <span class="date-time">{{DATA.time}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    DATA: {
      type: Object,
      default : {
        avatar: '',
        fullName: '', 
        status: '', // online || offline
        text: '', // sort text
        time: '', // thoi gian gan nhat nhan tin
      },
    }
  }
};
</script>

<style lang="scss" scoped>
$height_box: 80px;

.box-conversation {
  width: 100%;
  height: $height_box;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  user-select: none;
  transition: background .2s cubic-bezier(0.075, 0.82, 0.165, 1);

  &:hover {
    background: #d5e1e1;
    cursor: pointer;
  }

  .avatar {
    margin-right: 0.3rem;
    border-radius: 50%;
    position: relative;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: contain;
    }

    .dot-status {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      bottom: 0;
      right: 0;
    }
  }
  .meta {
    width: 100%;

    .name {
      font-weight: bold;
      opacity: 0.85;
    }
    .description {
      font-size: 0.95em;
      opacity: 0.6;
      display: flex;
      justify-content: flex-start;

      .last-text {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        padding-right: 10px;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        // word-break: break-word;
        // -webkit-tap-highlight-color: transparent;
      }
    }
  }
}
</style>