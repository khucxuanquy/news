<template>
  <div class="wrapper" v-loading.fullscreen.lock="!visible">
    <Header @showDialog="showDialog = true"></Header>
    <router-view />
    <DialogInfoUser v-if="showDialog" :dialogVisible="showDialog" @handleClose="showDialog = false" />
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "components/Header";
import Footer from "components/Footer";
import DialogInfoUser from "./dialogInfoUser.vue";
import ENUM from "const/api";
import { mapGetters, mapActions } from "vuex";
const { CATEGORIES, POSTS, USERS } = ENUM;

export default {
  data: function () {
    return {
      visible: false,
      showDialog: false
    };
  },
  components: {
    Header,
    Footer,
    DialogInfoUser
  },
  created() {
    let _user = localStorage.getItem("_user");
    _user = JSON.parse(_user);
    if (_user) this.CHANGE_USER_INFO(_user);

    var recognition = new webkitSpeechRecognition(); // khoi tao
    recognition.continuous = true; // tiếp tục nghe hay tắt sau khi nghe tiếp âm thanh
    recognition.interimResults = false; // đặt cho phép có kết quả tạm thời hay không
    recognition.lang = "vi-VN"; // cài đặt ngôn ngữ
    // recognition.start();
    recognition.onresult = function (event) {
      console.log(event.results[event.results.length - 1][0].transcript);
      // console.log(event.results[0]);
    };
    recognition.onerror = function (event) {
      // console.log('on_error', event);
    };
    recognition.onend = function (event) {
      // console.log('on_end', event);
      // recognition.start();
    };
    // let info = JSON.parse(localStorage.getItem('_user'))
    // this.CHANGE_MY_ACCOUNT(info)

    let body = document.querySelector("body").getBoundingClientRect();
    if (body.width < 500) {
      this.storeVue("_HOMEPAGE").dispatch("CHANGE_RESPONSIVE", false);
    }
    window.addEventListener("resize", this.handleResizeWindow);

    if (!this.categories.length) {
      this.getAPI(CATEGORIES.GET_ALL, {}, (res) => {
        if (!res.ok) return;
        this.CHANGE_CATEGORIES(res.data);
      });
    }

    if (!this.home.topNewFeed.length) {
      // inscease performance
      // if(/post|category/gi.test(location.pathname)) return this.visible = true;
      this.getAPI(POSTS.HOME, {}, (res) => {
        if (!res.ok) return;
        this.CHANGE_DATA_HOME(res.data);
        this.visible = true;
      });        
    } else this.visible = true
  },
  methods: {
    ...mapActions({
      CHANGE_MY_ACCOUNT: "_ACCOUNT/CHANGE_MY_ACCOUNT",
      CHANGE_USER_INFO: "_HOMEPAGE/CHANGE_USER_INFO",
    }),
    CHANGE_CATEGORIES(data) {
      this.storeVue("_CATEGORIES").dispatch("CHANGE", data);
    },
    CHANGE_DATA_HOME(data) {
      this.storeVue("_HOMEPAGE").dispatch("CHANGE_DATA_HOME", data);
    },
    handleResizeWindow({ currentTarget }) {
      let w = currentTarget.innerWidth;
      // neu la desktop
      if (this.responsive.isDesktop) {
        if (w < 500)
          this.storeVue("_HOMEPAGE").dispatch("CHANGE_RESPONSIVE", false);
      } else if (w >= 500)
        this.storeVue("_HOMEPAGE").dispatch("CHANGE_RESPONSIVE", true);
    },
  },
  computed: {
    ...mapGetters({
      categories: "_CATEGORIES/categories",
      home: "_HOMEPAGE/home",
      responsive: "_HOMEPAGE/responsive",
    }),
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResizeWindow);
  },
  watch: {
    "$route.params": function () {
      responsiveVoice.cancel();
    },
  },
};
</script>
<style lang="scss">
#homePage,
#category,
#post-detail {
  padding-top: 70px;
}
</style>