<template>
  <div
    class="box-conversation"
    :style="notification[DATA.id] ? 'color: #fff; background: linear-gradient(to right, #76b852, #8DC26F)' : ''"
  >
    <div class="avatar">
      <img :src="DATA.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'" alt="avatar" v-once/>
      <span class="dot-status" :style="{'background': `${DATA.status == 'online' ? '#42d340' : 'transparent'}`}"></span>
    </div>
    <div class="meta">
      <span class="name" v-once>{{DATA.fullName}}</span>
      <Bubble v-if="userEntering.includes(DATA.id)" /> 
      <div v-else class="description">
        <span class="last-text">{{DATA.content}}</span>
        <span class="date-time" v-if="DATA.dateCreated"> <i class="el-icon-time"/> {{ DATA.dateCreated }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Bubble from "../bubble"
export default {
  components: {
    Bubble,
  },
  props: {
    DATA: {
      type: Object,
      default : {
        avatar: '',
        fullName: '', 
        status: '', // online || offline
        content: '', // sort text
        dateCreated: '', // thoi gian gan nhat nhan tin
      },
    },
  },
  computed: {
    ...mapGetters({
      userEntering: '_MESSAGE/userEntering',
      notification: '_ACCOUNT/notification',
    })
  },
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

  cursor: pointer;
  &:hover {
    background: #d5e1e1;
  }
  &.active {
    background: #c0d2d6ed;
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
      flex-wrap: wrap;
      justify-content: flex-start;

      .last-text {
        font-weight: 600;
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