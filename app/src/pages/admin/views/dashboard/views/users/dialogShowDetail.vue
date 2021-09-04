<template>
  <el-dialog
    title="Thông tin người dùng"
    class="show-detail-info"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="() => $emit('handleClose')"
  >
    <!-- LAYOUT-WRAPPER -->
    <div class="layout-wrapper">
      <!-- AVATAR -->
      <img :src="imgAvatar" class="avatar">
      <div>
        <p class="block-item">
          <span> Họ tên </span>:
          <strong> {{ myAccount.fullName }} </strong>
        </p>
        
        <p class="block-item">
          <span> Chức vụ </span>:
          <strong> {{ permission(myAccount.permission) }} </strong>
        </p>

        <p class="block-item">
          <span> Ngày tham gia </span>:
          <strong> {{ convertDate(myAccount.dateCreated) }} </strong>
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import BoxChart from "components/box-chart";
import ENUM from 'const/api'
import CONST from 'const/const'
import { mapActions, mapGetters } from 'vuex';
const { POSTS, COMMENTS, USERS } = ENUM
// GET_COMMENTS_BY_USER_ID
const { convertDate } = CONST
export default {
  data() {
    return {
      imageDefault: "https://doan.khucblog.com/static/images/avatar-default.jpg",
    };
  },
  components: {
    BoxChart,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  created() {
  },
  methods: {
    ...mapActions({
      CHANGE_MY_ACCOUNT: "_ACCOUNT/CHANGE_MY_ACCOUNT",
    }),
    permission(number) {
      if(!number) return '- Error -'
      if(number == 3) return 'Admin'
      else if (number == 2) return this.lang.manage
      else return this.lang.staff
    },
    convertDate(timestamp) {
      return convertDate(0, Number(timestamp))
    },
  },
  computed: {
    ...mapGetters({
      myAccount: "_ACCOUNT/myAccount",
      userInfoDetail: "_HOMEPAGE/userInfoDetail",
    }),
    imgAvatar() {
      return this.myAccount.avatar || this.imageDefault
    }
  }
};
</script>
<style lang="scss">
.show-detail-info {
  $shadow2: #0000001a 0px 0px 20px;

  .layout-wrapper {
    .avatar-uploader {
      max-width: 100px;
      position: relative;
      border: thin solid #05050523;
      border-radius: 8px;
      align-self: flex-start;
      & > div {
        &:before {
          content: '';
          position: absolute;
          top: 0%;
          left: 0%;
          width: 100%;
          height: 100%;
          background: transparent;
          transition: all .2s;
        }
        &:hover {
          &:before {
            background: #050505a6;
            box-shadow: 0 4px 18px -4px #050505a6;
          }
          .avatar-uploader-icon {
            display: unset;
            color: whitesmoke;
          }  
        }
        img {
          padding: .7em;
          border-radius: 8px;
        }
        .avatar-uploader-icon {
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.5);
          font-weight: bold;
        }
      }

      
    }

    .block-item {
      margin-bottom: 1em;
    }

    .title-divider > div:hover {
      user-select: none;
      cursor: pointer;
      color: #76b852; // #8DC26F;
    }
  }
  .el-divider__text {
    background: #fff;
  }
}
</style>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
