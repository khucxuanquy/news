<template>
  <div id="layout-dashboard" class="wrapper">
    <Header :isCollapse="isCollapse"></Header>
    <div class="main-dashboard">
      <div class="topbar">
        <h5 style="margin: 0" @click="handleCollapseNavbar()">
          <i class="el-icon-more-outline"></i>
        </h5>
        <div style="margin-right: 1rem">
          <el-dropdown trigger="click" @command="handleCurrentLanguage" class="dropdown-langs">
            <span class="el-dropdown-link">
            <span style="padding: 5px">{{currentLanguage}}</span><i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="en">EN</el-dropdown-item>
                <el-dropdown-item command="vi">VI</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" @command="handleClickItem">
            <span class="el-dropdown-link"><span style="padding: 5px">{{myAccount.fullName}}</span><i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="editInfo">{{lang.editInfo}}</el-dropdown-item> -->
                <el-dropdown-item command="logout">{{lang.logout}}</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header/header";
import {mapGetters, mapActions} from 'vuex'
import ENUM from "const/api";
const { CATEGORIES, USERS } = ENUM
export default {
  data: function(){
    return {
      isCollapse: false,
      currentLanguage: localStorage.getItem('lang') && localStorage.getItem('lang').toUpperCase() == 'EN' ? 'EN' : 'VI',
      ga: false
    }
  },
  components: {
    Header,
  },
  methods: {
    ...mapActions({
      CHANGE_LANGUAGES: '_LANGUAGES/CHANGE_LANGUAGES',
      CHANGE_CATEGORIES: '_CATEGORIES/CHANGE',
      CHANGE_POSTS: '_POSTS/CHANGE',
      CHANGE_TOTAL_POSTS: '_POSTS/CHANGE_TOTAL',
      CHANGE_USERS: '_USERS/CHANGE',
      CHANGE_REPORTS: '_REPORTS/CHANGE',
      CHANGE_MY_ACCOUNT: '_ACCOUNT/CHANGE_MY_ACCOUNT',
    }),
    handleCollapseNavbar(){
      let collapse = !this.isCollapse
      this.isCollapse = collapse
      localStorage.setItem('collapse', collapse)
    },
    handleCurrentLanguage(language){
      this.CHANGE_LANGUAGES(language)
      this.currentLanguage = language.toUpperCase()
      localStorage.setItem('lang', language)
    },
    handleClickItem(name){
      if(name == 'logout') {
        localStorage.removeItem('_u')
        localStorage.removeItem('_info')
        this.postAPI(USERS.LOGOUT, {}, _ => { } )
        this.CHANGE_POSTS([])
        this.CHANGE_USERS([])
        this.CHANGE_REPORTS([])
        this.CHANGE_MY_ACCOUNT({})
        this.CHANGE_TOTAL_POSTS(0)
        this.$router.push('/admin/login')
      } else if (name == 'editInfo') {

      }
    }
  },
  created() {
    let info = localStorage.getItem('_info')
    info = JSON.parse(info)

    if(localStorage.getItem('collapse') && localStorage.getItem('collapse').trim() === 'true') this.isCollapse = true;

    if(!this.categories.length) {
      this.getAPI(CATEGORIES.GET_CATEGORIES_IN_DASHBOARD, { }, res => {
        if(!res.ok) return;
        this.CHANGE_CATEGORIES(res.data)
      })
    }
  },
  computed:{
    ...mapGetters({
      categories: '_CATEGORIES/categories',
      posts: '_POSTS/posts',
      users: '_USERS/users',
      myAccount: '_ACCOUNT/myAccount',
    }),
  },
  watch: {
    '$route.params': function() {
      
      
    }
  }
};
</script>

<style lang="scss" scoped>
  #layout-dashboard{
    display: flex;
    .topbar {
      border-bottom: 1px solid #8080802a;
      display: flex;
      align-items: center;
      padding: .6rem .5rem;
      justify-content: space-between;
      .dropdown-langs {
        border: 1px solid;
        padding: .1rem .3rem;
        border-radius: 4px
      }
    }
    
    .main-dashboard {
      height: 100vh;
      width: 100%;
      overflow-y: auto;
    }
  }
</style>
