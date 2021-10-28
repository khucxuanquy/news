<template>
  <el-dialog
    title="Thông tin người dùng"
    class="show-detail-info"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="() => $emit('handleClose')"
  >
  <!-- LAYOUT-WRAPPER -->
    <div class="layout-wrapper">
      <!-- LEFT -->
      <div class="left-layout">
        <!-- AVATAR -->
        <img :src="imgAvatar" class="avatar">
        <div>
          <p class="block-item">
            <span> Họ tên </span>:
            <strong> {{ dataRender.fullName }} </strong>
          </p>
          
          <p class="block-item">
            <span> Chức vụ </span>:
            <strong> {{ permission(dataRender.permission) }} </strong>
          </p>

          <p class="block-item">
            <span> Ngày tham gia </span>:
            <strong> {{ convertDate(dataRender.dateCreated) }} </strong>
          </p>
        </div>
        <div style="width: 100%">
          <div class="listStaff" v-if="Array.isArray(dataRender.listUsers)">
            <el-tooltip v-for="user in dataRender.listUsers" :key="user.id" :content="user.fullName" placement="top-start" effect="dark">
              <div class="staff">
                <img :src="user.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'">
                <span v-text="user.username" />
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <!-- RIGHT -->
      <div class="right-layout">
        <el-divider class="title-divider" content-position="left"> Thống kê cá nhân </el-divider>

        <div class="wrapper-overview">
          <div class="box-child" style="background: linear-gradient(45deg, rgb(64, 153, 255), rgb(115, 180, 255))">
            <span>Tổng bài viết</span>
            <strong v-if="dataRender.byTotalPost">
              {{ dataRender.byTotalPost.total || 0 }}
            </strong>
          </div>
          <div class="box-child" style="background: linear-gradient(45deg, rgb(46, 216, 182), rgb(89, 224, 197))">
            <span>Tổng Lượt xem</span>
            <strong  v-if="dataRender.byTotalViews">
              {{ dataRender.byTotalViews.total || 0 }}
            </strong>
          </div>
        </div>

        <div class="chart-statistics" v-if="dataRender.byTotalPost && dataRender.byTotalViews">
          <BoxChart
            :DATA="dataRender.byTotalPost"
            typeChart="pie"
            :title="'Thống kê số bài viết theo chủ đề'"
          />
          <BoxChart
            :DATA="dataRender.byTotalViews"
            typeChart="pie"
            :title="'Thống kê số lượt xem theo chủ đề'"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import BoxChart from "components/box-chart";
import CONST from 'const/const'
// GET_COMMENTS_BY_USER_ID
const { convertDate } = CONST
export default {
  components: {
    BoxChart,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    dataRender: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
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
    imgAvatar() {
      return this.dataRender.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'
    },
  }
};
</script>
<style lang="scss">
.show-detail-info {
  $shadow2: #0000001a 0px 0px 20px;

  .layout-wrapper {
    display: flex;
    // LEFT-LAYOUT
    .left-layout {
      width: 30%;
      padding-right: 1em;
      border-right: 1px solid #05050523;
      display: flex;
      flex-wrap: wrap;
      gap: 1em;
      height: 100%;

      img.avatar {
        object-fit: contain;
        max-width: 100px;
        border-radius: 8px;
      }

      .block-item {
        margin-bottom: 1em;
      }

      .title-divider > div:hover {
        user-select: none;
        cursor: pointer;
        color: #76b852; // #8DC26F;
      }

      .listStaff {
        display: flex;
        flex-wrap: wrap;

        .staff {
          width: 25%;
          padding: 10px;
          text-align: center;
          img {
            padding: 3px;
            border-radius: 50%;
            border: thin solid;
            object-fit: cover;
            aspect-ratio: 1 / 1;
            box-shadow: 0px 5px 20px 0px #42424230;
          }
        }
      }
    }
    // RIGHT-LAYOUT
    .right-layout {
      width: 70%;
      padding-left: 1em;

      .chart-statistics {
        display: flex;
        & > * {
          flex-grow: 1;
        }
      }
      .wrapper-overview {
        display: flex;
        margin-bottom: 3em;
        .box-child {
          flex-grow: 1;
          text-align: center;
          color: #333;
          min-height: 100px;
          margin: 0 1em;
          padding: 0 1em;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 8px;
          user-select: none;
          transition: all 0.2s linear;
          box-shadow: $shadow2;

          strong {
            transition: all 0.2s;
          }
          &:hover {
            strong {
              color: white;
            }
          }
          span {
            color: #333;
            font-size: 2em;
          }
          strong {
            color: #424242;
            font-size: 5em;
          }
        }
      }
      .history-comments {

        .item {
          border-radius: 6px;
          padding: 1em 0 0 1em;
          
          .item-title {
            cursor: pointer;
            &:hover {
              color: transparent;
              background :linear-gradient(to right, #76b852, #8DC26F);
              -webkit-background-clip: text;
            }
          }

          &:hover {
            cursor: pointer;
            background: #eee;
            box-shadow: 0 4px 18px -4px #eeeeeea6;
          }

          p {
            margin: 0;

            span.testing {
              display: inline-block;
              padding: 3px 5px;
              margin:.2rem .5rem;
              border-radius: 4px;
              color: white
            }
          }
        } 
          
      }
     
    }
  }
  .el-divider__text {
    background: #fff;
  }
}
</style>
