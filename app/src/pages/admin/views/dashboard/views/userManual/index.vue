<template>
  <div id="userManual-dashboard" v-loading.fullscreen.lock="isLoading">
    <div class="banner-top">
      <h5>Hướng dẫn sử dụng</h5>
      <img class="userManual-banner" src="https://doan.khucblog.com/static/images/userManual/banner-huong-dan-su-dung.png" />
    </div>

    <!-- <el-divider content-position="left"><h5>Hướng dẫn sử dụng</h5></el-divider> -->
    <el-collapse v-model="activeNames" @change="handleChange">
      <!--  -->
      <el-collapse-item name="1" title="Tin nhắn">
        <div>
          hi
        </div>
      </el-collapse-item>
      <!--  -->
      <el-collapse-item name="2" title="Quản lí Bài viết">
        <el-collapse style="margin-left: 2em" v-model="activeNames2" @change="handleChange">
        <el-collapse-item name="2.1" title="Làm thế nào để tôi có thể xuất bản bài viết ?">
            <div>
              <p>
                Vào Quản lý bài viết, nhảy sang tab Thêm mới bài viết ở đây bạn có thể viết nội dung sau đó bấm nút "Thêm mới" để thêm bài viết vào dữ liệu của hệ thống.
              </p>
              <img src="https://doan.khucblog.com/static/images/userManual/posts/them_bai_viet_moi.png" />
            <p>
              Sang tab quản lý bài viết, bạn bấm vào nút kích hoạt để có thể xuất bản bài viết (Chỉ có admin hoặc Quản lý có thể xuất bản bài viết của mình).
            </p>
              <img src="https://doan.khucblog.com/static/images/userManual/posts/kich-hoat-bai-viet.png" />
            </div>
        </el-collapse-item>
        <el-collapse-item name="2.2" title="Tôi có thể xem tóm tắt bài viết được không ?">
            <div>
              <p>
                Ban có thể nhấn hình mũi tên ở đây xem tóm tắt bài viết.
              </p>
              <img src="https://doan.khucblog.com/static/images/userManual/posts/xem-tom-tat-bai-viet.png" />
            </div>
        </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
      <!--  -->
      <el-collapse-item name="3" title="Quản lí chủ đề">
        <el-collapse style="margin-left: 2em" v-model="activeNames2" @change="handleChange">
          <el-collapse-item name="3.1" title="Làm thế nào để tôi có thể thêm một chủ đề mới ?">
            <div>
              <p>Ở đây, bạn có thể thêm sửa xóa rất gọn và trực quan.</p>
              <img
                style="width: 80%"
                src="https://doan.khucblog.com/static/images/userManual/categories/img1.png"
              />
              <p>
                Khi bạn thêm mới chủ đề, bạn có thể chọn màu sắc sao cho phù hợp với
                chủ đề mà bạn đang muốn tạo.
              </p>
              <img
                style="width: 50%"
                src="https://doan.khucblog.com/static/images/userManual/categories/img2.png"
              />
            </div>            
          </el-collapse-item> 
        </el-collapse>
      </el-collapse-item>
      <!--  -->
      <el-collapse-item name="4" title="Người dùng">
        <el-collapse style="margin-left: 2em" v-model="activeNames2" @change="handleChange">
          <el-collapse-item name="4.1" title="Thêm tài khoản nhân viên mới mà mình quản lý ?">
            <div>
              Khi chính bạn tạo tài khoản mới cho nhân viên thì bạn là quản lý trực tiếp của nhân viên đó.
            </div>            
          </el-collapse-item> 
        </el-collapse>
      </el-collapse-item>
      <!--  -->
      <el-collapse-item name="5" title="Báo cáo">
        <div>
          <p>
            Dữ liệu trong báo cáo đều từ phía người dùng phản ánh lại về các vấn đề mà trong bài viết xảy ra như ngôn từ sai, lỗi đánh máy, tin giả, ...
          </p>
          <p>
            Bạn bấm mũi tên để xem chi tiết và click vào tên bài viết.
          </p>
          <img src="https://doan.khucblog.com/static/images/userManual/reports/bao-cao-1.png" />
          <p>
            Lúc này nó sẽ hiện ra hộp sửa đổi để mình có thể chính sửa bài viết đó một cách nhanh chóng.
          </p>
          <img src="https://doan.khucblog.com/static/images/userManual/reports/bao-cao-2.png" />
        </div>
      </el-collapse-item>
      <!--  -->
      <el-collapse-item name="6" title="Thống kê">
        <div>
          <p>Ở đây bạn có thể xem thống kê lượt xem với các chủ đề cụ thể. Nếu không chọn chủ đề nào để xem thì mặc định sẽ thống kê tất cả chủ đề</p>
          <img src="https://doan.khucblog.com/static/images/userManual/statistics/thong-ke-1.png" >
        </div>
      </el-collapse-item>
      <!--  -->
      <el-collapse-item name="7" title="Thông tin tài khoản">
        <div>
          hi
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import ENUM from "const/api";
import CONST from "const/const";
import { mapGetters } from "vuex";
const { REPORTS } = ENUM;
export default {
  data() {
    return {
      isLoading: false,
      activeNames: null,
      activeNames2: null
      
    };
  },
  components: {},
  beforeCreate() {
    if (!localStorage.getItem("_u")) return this.$router.push("/admin/login").catch(() => {});
  },
  created() {},
  methods: {
    handleChange(val) {}
  },
  computed: {
    ...mapGetters({
      myAccount: "_ACCOUNT/myAccount"
    })
  }
};
</script>

<style lang="scss" scoped>
#userManual-dashboard {
  padding: 1em;
  img:not(.userManual-banner) {
    width: 70%;
    box-shadow: 0 4px 18px -4px #00000021;
    border-radius: 12px;
    margin: auto;
    display: block;
  }
  .banner-top {
    position: relative;
    width: 100%;
    min-height: 300px;
    margin-bottom: 2em;
    h5 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      color: #409eff;
      font-size: 30px;
    }
    img.userManual-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
