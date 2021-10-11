<template>
  <el-dialog
    title="Thông tin người dùng"
    class="dialog-hash-class-asci1kb31r81r13"
    :visible.sync="dialogVisible"
    width="90%"
    :before-close="handleClose"
  >
    <!-- LAYOUT-WRAPPER -->
    <div class="layout-wrapper">
      <!-- LEFT -->
      <div class="left-layout">
        <!-- AVATAR -->
        <el-upload
          class="avatar-uploader"
          :action="action"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img :src="imgAvatar" class="avatar">
          <i title="Thay đối avatar" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

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
        <!--  -->
        <div style="width: 100%">
          <!-- ACCOUNT -->
          <el-divider class="title-divider" content-position="left" @click="isShow.account = !isShow.account">
            <i
              style="transition: all .3s"
              :style="`transform: rotate(${isShow.account ? '180': '0'}deg)`"
              class="el-icon-arrow-up" /> Tài khoản
          </el-divider>
          <transition name="fade">
            <p class="block-item" v-if="isShow.account">
              <!-- USERNAME -->
              <el-input class="block-item" disabled v-model="formAccount.username" :placeholder="myAccount.username">
                <template slot="prepend"> <i class="el-icon-user-solid"></i> Tên đăng nhập</template>
              </el-input>
              <!-- FULLNAME -->
              <el-input
                v-model="formAccount.fullName"
                :disabled="!isShow.changeFullName"
                :placeholder="myAccount.fullName"
                maxlength="30"
              >
                <template slot="prepend"> <i class="el-icon-user-solid" /> Tên người dùng</template>
                <el-button
                  slot="append" plain
                  @click="isShow.changeFullName = !isShow.changeFullName, !isShow.changeFullName ? cancelSubmitForm() : ''"
                  :type="!isShow.changeFullName ? 'primary' : 'warning'"
                  :icon="!isShow.changeFullName ? 'el-icon-edit-outline' : 'el-icon-close'"></el-button>
                <!-- <el-button slot="append" v-show="isShow.changeFullName" @click="isShow.changeFullName = false" plain type="warning" icon="el-icon-close"></el-button> -->
                <!-- <el-button slot="append" v-show="isShow.changeFullName" @click="isShow.changeFullName = false" plain type="primary" icon="el-icon-check"></el-button> -->
              </el-input>
            </p>
          </transition>

          <!-- CHANG PASSWORD -->
          <div class="block-item">
            <el-divider class="title-divider" content-position="left" @click="isShow.changePassword = !isShow.changePassword">
              <i
              style="transition: all .3s"
              :style="`transform: rotate(${isShow.changePassword ? '180': '0'}deg)`"
              class="el-icon-arrow-up" /> Đổi mật khẩu
            </el-divider>
            <transition name="fade">
              <div v-if="isShow.changePassword">
              <el-input show-password placeholder="Mật khẩu cũ" v-model="formAccount.oldPassword">
                <template slot="prepend"> <i class="el-icon-lock"/> </template>
              </el-input>

              <div class="block-item" />

              <el-input show-password placeholder="Mật khẩu mới" v-model="formAccount.password">
                <template slot="prepend"> <i class="el-icon-lock"/> </template>
              </el-input>

              <div class="block-item" />
              
              <el-input show-password placeholder="Nhập lại mật khẩu" v-model="formAccount.rePassword">
                <template slot="prepend"> <i class="el-icon-lock"/> </template>
              </el-input>
              <!-- <div style="text-align: center; margin-top: 2em">
                <el-button plain type="warning" @click="isShow.changePassword = false">Hủy</el-button>
                <el-button plain type="primary" @click="submitChangePassword()">Xác nhận</el-button>
              </div> -->
              </div>
            </transition>
          </div>
        </div>
       
        <!-- FOOTER -->
        <div v-if="isShow.hasChangeFormAccount" style="text-align: center; width: 100%">
          <el-button type="danger" plain @click="cancelSubmitForm()">Hủy</el-button>
          <el-button type="warning" plain @click="formAccount = {}, showTempAvatar = ''">xóa</el-button>
          <el-button type="success" plain @click="submitForm()">Lưu</el-button>
        </div>
      </div>
      <!-- RIGHT -->
      <div class="right-layout">
        <el-divider class="title-divider" content-position="left"> Thống kê cá nhân </el-divider>

        <div class="wrapper-overview">
          <div class="box-child" style="background: linear-gradient(45deg, rgb(64, 153, 255), rgb(115, 180, 255))">
            <span>Tổng bài viết</span>
            <strong v-if="statisticOverview.byTotalPost">
              {{ statisticOverview.byTotalPost.total }}
            </strong>
          </div>
          <div class="box-child" style="background: linear-gradient(45deg, rgb(46, 216, 182), rgb(89, 224, 197))">
            <span>Tổng Lượt xem</span>
            <strong  v-if="statisticOverview.byTotalViews">
              {{ statisticOverview.byTotalViews.total }}
            </strong>
          </div>
        </div>

        <div class="chart-statistics">
          <BoxChart
            v-if="statisticOverview.byTotalPost"
            :DATA="statisticOverview.byTotalPost"
            typeChart="pie"
            :title="'Thống kê số bài viết theo chủ đề'"
          />
          <BoxChart
            v-if="statisticOverview.byTotalViews"
            :DATA="statisticOverview.byTotalViews"
            typeChart="pie"
            :title="'Thống kê số lượt xem theo chủ đề'"
          />
        </div>
        <!-- HISTORY_COMMENTS -->
        <el-divider class="title-divider" content-position="left"> Lịch sử hoạt động </el-divider>
        <div class="history-comments">
          <div class="item" v-for="item in statisticHistoryComment" :key="item.comment_id">
            <p> Bài viết: <strong class="item-title" @click="openNewWindow(item)"> {{ item.title }} </strong> </p>
            <p> Chủ đề: <span v-html="getCategoryById(item.category_id)"></span></p>
            <p> Nội dung: <strong> {{ item.content }} </strong></p>
            <p style="margin-top: .3em">
              <i class="el-icon-time"/>
              <span style="opacity: .7; margin-right: 1em"> {{ item.dateCreated }} </span>
              <i class="far fa-thumbs-up" /> {{ item.reaction }} <span style="opacity: .6"> Thích </span>
            </p>
            <el-divider class="title-divider"/>
          </div>
          <el-button v-show="!isMaxComments" type="primary" style="margin-left: calc(50% - 55px)" plain @click="getCommentsByUserId()">Xem Thêm</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import BoxChart from "components/box-chart";
import ENUM from 'const/api'
import CONST from 'const/const'
import { mapActions, mapGetters } from 'vuex';
const { MEDIA, POSTS, COMMENTS, USERS } = ENUM
// GET_COMMENTS_BY_USER_ID
const { convertDate } = CONST
export default {
  data() {
    return {
      imageDefault: "https://doan.khucblog.com/static/images/avatar-default.jpg",
      showAvatar: false,
      action: MEDIA,
      isShow: {
        account: false,
        changePassword: false,
        changeFullName: false,
        hasChangeFormAccount: false
      },
      formAccount: {},
      showTempAvatar: '',
      from: 0,
      limit: 5,
      isMaxComments: false
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
    if(this.statisticOverview && !this.statisticOverview['byTotalPost'])  {
      this.getAPI(POSTS.STATISTIC_USER, {}, response => {
        let { ok, data } = response
        if(!ok) return;
        let labels = data.map(i => this.getBoxCategryById(i.category_id).name)
        let dataInput = {
          byTotalPost: {
            total: data.reduce((a, b) => a + b.totalPosts, 0),
            labels,
            datasets: [
              {
                label: 'Tổng bài viết',
                data: data.map(i => i.totalPosts || 0)
              }
            ]
          },
          byTotalViews: {
            total: data.reduce((a, b) => a + b.totalViews, 0),
            labels,
            datasets: [
              {
                label: 'Tổng lượt xem',
                data: data.map(i => i.totalViews || 0)
              }
            ]
          },
        }
        this.CHANGE_STATISTIC_OVERVIEW(dataInput)
      })
    }
    // if(!this.statisticHistoryComment.length) this.getCommentsByUserId();
    this.CHANGE_STATISTIC_HISTORY_COMMENT([])
    this.getCommentsByUserId();
  },
  watch:{
    // formAccount(e) {
    //   if(Object.entries(e).length) this.isShow.hasChangeFormAccount = true
    // },
    formAccount: {
      handler(val) {
        let keys = Object.keys(val)
        if(!keys.length) return;
        this.isShow.hasChangeFormAccount = true
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      CHANGE_MY_ACCOUNT: "_ACCOUNT/CHANGE_MY_ACCOUNT",
      CHANGE_STATISTIC_OVERVIEW: "_HOMEPAGE/CHANGE_STATISTIC_OVERVIEW",
      CHANGE_STATISTIC_HISTORY_COMMENT: "_HOMEPAGE/CHANGE_STATISTIC_HISTORY_COMMENT",
    }),
    handleAvatarSuccess(res, file) {
      let avatar = res.location 
      // show tạm
      this.showTempAvatar = avatar
      this.formAccount.avatar = avatar
      this.isShow.hasChangeFormAccount = true
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt500Kb = file.size / 1024 / 1024 < 0.5
      if (!isLt500Kb) return this.$message.error("Độ lớn ảnh không được quá 500kb!")
      return isLt500Kb
    },
    handleClose(done) {
      return this.$emit("handleClose");
      this.$confirm("Are you sure to close this dialog?")
        .then(_ => {
          done();
          this.$emit("handleClose");
        })
        .catch(_ => {});
    },
    permission(number) {
      if(!number) return '- Error -'
      if(number == 3) return 'Admin'
      else if (number == 2) return this.lang.manage
      else return this.lang.staff
    },
    convertDate(timestamp) {
      return convertDate(0, Number(timestamp))
    },
    submitForm(){
      let dataInput = {}
      const { password, rePassword, oldPassword, fullName, avatar } = this.formAccount
      if(password || rePassword || oldPassword) {
        if(password !== rePassword) return this.$message({type: 'warning', message: 'mật khẩu không giống nhau'});
        if(!oldPassword)  return this.$message({type: 'warning', message: 'vui lòng nhập mật khẩu cũ' });
        dataInput.password = password
        dataInput.rePassword = rePassword
        dataInput.oldPassword = oldPassword
      }
      if(fullName) dataInput.fullName = fullName
      if(avatar) dataInput.avatar = avatar

      this.putAPI(USERS.CHANGE_USER_INFO, dataInput, response => {
        if(!response.ok) return this.$message({ type: 'danger', message: 'đã có lỗi xảy ra' });
        this.$message({ type: 'success', message: 'Cập nhật thành công' });
        let tempAccount = JSON.parse(JSON.stringify(this.myAccount))
        if(avatar) tempAccount.avatar = avatar
        if(fullName) tempAccount.fullName = fullName
        this.CHANGE_MY_ACCOUNT(tempAccount)
        this.cancelSubmitForm()
      })
    },
    cancelSubmitForm() {
      this.formAccount = {}
      this.isShow.account = false
      this.isShow.changePassword = false
      this.isShow.changeFullName = false
      this.isShow.hasChangeFormAccount = false
      
    },
    getBoxCategryById(id) {
      if (!id) return {};
      return this.categories.find(i => i.id == id) || {}
    },
    getCategoryById(id){
      if(!id) return ''
      let category = this.categories.find(i => i.id == id)
      return category ? `<span class="testing" style="background: ${category.color || '#000000'}">${category.name}</span>` : ''
    },
    getCommentsByUserId() {
      if(this.isMaxComments) return;
      const { from, limit } = this
      this.getAPI(COMMENTS.GET_COMMENTS_BY_USER_ID, { limit, from }, response => {
        let { ok, data } = response
        if(!ok) return this.isMaxComments = true;
        if(data.length < limit) this.isMaxComments = true;
        this.from += this.limit
        data = data.map(i => ({...i, category_url: this.getBoxCategryById(i.category_id).url}))
        this.CHANGE_STATISTIC_HISTORY_COMMENT([...this.statisticHistoryComment, ...data])
      })
    },
    openNewWindow(item) {
      window.open(`${location.origin}/post/${item.category_url}/${item.url}`, '_blank')
    }
  },
  computed: {
    ...mapGetters({
      myAccount: "_ACCOUNT/myAccount",
      categories: "_CATEGORIES/categories",
      userInfoDetail: "_HOMEPAGE/userInfoDetail",
      statisticOverview: "_HOMEPAGE/statisticOverview",
      statisticHistoryComment: "_HOMEPAGE/statisticHistoryComment",
    }),
    imgAvatar() {
      return this.showTempAvatar || this.myAccount.avatar || this.imageDefault
    }
  }
};
</script>
<style lang="scss">
.dialog-hash-class-asci1kb31r81r13 {
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
  // & > div {
  //   .el-dialog__body {
  //     max-height: 70vh;
  //     overflow-y: auto;
  //   }
  // }
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
