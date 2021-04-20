<template>
  <div class="wrapper" v-loading.fullscreen.lock="!visible">
    <Header></Header>
    <router-view />
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "components/Header";
import Footer from "components/footer";
import ENUM from "const/api";
const { CATEGORIES, POSTS } = ENUM

export default {
  data: function(){
    return {
      visible: false
    }
  },
  components: {
    Header,
    Footer,
  },
  created() {
    let body = document.querySelector('body').getBoundingClientRect()
    if(body.width < 500) {
      this.storeVue('_HOMEPAGE').dispatch('CHANGE_RESPONSIVE', false);
    }
    window.addEventListener("resize", this.handleResizeWindow);

    if (!this.categories.length) {
      this.getAPI(CATEGORIES.GET_ALL, {}, (res) => {
        if (!res.ok) return;
        this.CHANGE_CATEGORIES(res.data);
      });
    }

    if (!this.home.length) {
      this.getAPI(POSTS.HOME, {}, (res) => {
        if (!res.ok) return;
        this.CHANGE_DATA_HOME(res.data);
        this.visible = true
      });
    }
  },
  methods: {
    CHANGE_CATEGORIES(data) {
      this.storeVue('_CATEGORIES').dispatch('CHANGE', data);
    },
    CHANGE_DATA_HOME(data) {
      this.storeVue('_HOMEPAGE').dispatch('CHANGE_DATA_HOME', data);
    },
    handleResizeWindow({ currentTarget }){
      let w = currentTarget.innerWidth
      // neu la desktop
      if(this.responsive.isDesktop) {
        if(w < 500) this.storeVue('_HOMEPAGE').dispatch('CHANGE_RESPONSIVE', false)
      }
      else if(w >= 500) this.storeVue('_HOMEPAGE').dispatch('CHANGE_RESPONSIVE', true)
    }
  },
  computed: {
    categories() {
      return this.storeVue('_CATEGORIES').getters.categories;
    },
    home() {
      return this.storeVue('_HOMEPAGE').getters.home;
    },
    responsive() {
      return this.storeVue('_HOMEPAGE').getters.responsive;
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResizeWindow);
  },
};
</script>