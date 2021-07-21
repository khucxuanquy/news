<template>
  <div  class="wrapper-footer">
    <transition name="fade">
      <button v-if="isShowBtn || !responsive.isDesktop" class="gotopbtn" @click="scrollToTop()">
        <i class="fas fa-arrow-up"></i>
      </button>
    </transition>
    <div style="position: fixed; z-index: 999; bottom: 45vh; right: 0">
      <!-- <strong
      style="
        display: block;
        text-align: center;
        background: #443355;
        padding: 4px 8px;
        border-radius: 8px;
      "
      :style="`color: ${ darkTheme ? '#443355' : '#fff' }; background: ${ darkTheme ? '#fff' : '#443355' }`"
        v-text="darkTheme ? 'dark' : 'light'"/> -->
          <!-- box-shadow: 0 4px 18px -4px #283046a6; -->

      <el-switch
        v-model="darkTheme"
        @change="changeTheme()"
        style="
          border-radius: 18px;
          transform: scale(1.2) rotate(90deg);
          right: -4px;
        "
        active-color="#443355"
        inactive-color="#d4ecf0">
      </el-switch>
      <!-- <el-button
        v-if="darkTheme === false"
        circle
        plain
        type="primary"
        icon="el-icon-sunny"
        @click="darkTheme = true"
      />
      <el-button
        v-else
        circle
        plain
        type="info"
        icon="el-icon-moon"
        @click="darkTheme = false"
      /> -->
    </div>
    <!-- Footer -->
    <footer class="container">
      <table class="table" style="width: 100%; height: 100%">
        <tr class="text">
          <td>
            <h4>TRỤ SỞ CHÍNH</h4>
          </td>
          <td>
            <h4>VĂN PHÒNG HÀ NỘI</h4>
          </td>
        </tr>
        <tr>
          <td>
            <ul>
              <li>
                Tầng 4,Tòa nhà Flemington, 182 Lê Đại Hành, P.15, Q.11, Hồ Chí
                Minh.
              </li>
              <li>
                Tổng đài hỗ trợ:<b> 1900.636.099 </b>(Thứ 2 đến Thứ 6 từ 8h đến
                18h;<br />
                Thứ 7 và Chủ nhật từ 8h00 đến 17h00)
              </li>
              <li>Số hỗ trợ ngoài giờ:<b> 0901.866.099 </b></li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                Tầng 1, Tòa nhà GP Invest, 170 Đê La Thành, Ô Chợ Dừa, Đống Đa,
                Hà Nội.
              </li>
              <li>
                Tổng đài hỗ trợ:<b> 1900.636.099 </b>(Thứ 2 đến Thứ 6 từ 8h đến
                18h;<br />
                Thứ 7 và Chủ nhật từ 8h00 đến 17h00)
              </li>
              <li>Số hỗ trợ ngoài giờ:<b> 0901.866.099 </b></li>
            </ul>
          </td>
        </tr>
      </table>
    </footer>
    <div class="bar">
      <div class="clear"></div>
      <div class="copyright">
        Email:hi@haravan.com | Số điện thoại tiếp nhận khiếu nại:<b
          > 0903.119.101</b
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      isShowBtn: false,
      darkTheme: false,
    };
  },
  mounted() {
    let debounce_time;
    window.onscroll = () => {
      if (debounce_time) clearTimeout(debounce_time);
      debounce_time = setTimeout(() => {
        let _ = document.documentElement.scrollTop || document.body.scrollTop
        if(_ > 300 !== this.isShowBtn) {
          this.isShowBtn = !this.isShowBtn;
          if(_ > 300) document.body.classList.add('scrolling')
          else document.body.classList.remove('scrolling')
        }
      }, 30);
    };
  },
  created() {
    let dark_theme = JSON.parse(localStorage.getItem("dark-theme"))
    this.darkTheme = dark_theme ? true : false
    this.changeTheme()
  },
  methods: {
    scrollToTop() {
      document.querySelector(".wrapper").scrollIntoView({behavior: 'smooth'});
    },
    changeTheme() {
      let body = document.querySelector('body') 
      if(this.darkTheme) body.classList.add("dark-theme")
      else body.classList.remove("dark-theme")
      localStorage.setItem("dark-theme" , JSON.stringify(this.darkTheme))
    }
  },
  computed: {
    ...mapGetters({
      responsive: '_HOMEPAGE/responsive',
    })
  },
};
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.wrapper-footer {
  background: #eee;
  margin-top: 3em
}
.gotopbtn {
  position: fixed;
  width: 50px;
  height: 50px;
  background: #27ae60;
  bottom: 5vh;
  right: 2vw;
  line-height: 50px;
  color: white;
  font-size: 22px;
  z-index: 999;
  outline: none;
  border: none;
  border-radius: 8px;
}
body {
  font-family: "Times New Roman", serif;
}

.clear {
  clear: both;
}

table td {
  padding: 15px;
  background-color: #eee;
}
footer > ul li {
  color: #999999;
  float: left;
  font-size: 80px;
  line-height: 80px;
}
footer > ul li .text {
  color: black;
  font-size: 13px;
  line-height: 20px;
  margin-left: 105px;
  position: relative;
  text-align: justify;
}
.text h4 {
  color: black;
  font-size: 24px;
  font-weight: bold;
  text-align: left;
}
.bar {
  background-color: #dddddd;
  position: relative;
  padding: 20px 0;
}
.bar-wrap {
  font-size: 12px;
  margin: 0 auto;
  max-width: 1200px;
  position: relative;
  width: 95%;
}
.copyright {
  color: black;
  margin-top: 5px;
  text-align: center;
}
</style>