<template>
  <div id="userManual-dashboard" v-loading.fullscreen.lock="isLoading">
    <el-divider content-position="left"><h5>Hướng dẫn sử dụng</h5></el-divider>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1" title="Tin nhắn">
        <div>
          hi
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" title="Quản lí văn bản">
        <div>
          hi
        </div>
      </el-collapse-item>
      <el-collapse-item name="3" title="Quản lí chủ đề">
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
      <el-collapse-item name="4" title="Người dùng">
        <div>
          hi
        </div>
      </el-collapse-item>
      <el-collapse-item name="5" title="Báo cáo">
        <div>
          hi
        </div>
      </el-collapse-item>
      <el-collapse-item name="6" title="Thống kê">
        <div>
          hi
        </div>
      </el-collapse-item>
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
      activeNames: null
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
}
</style>
