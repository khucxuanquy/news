<template>
  <div id="layout-dashboard" class="wrapper">
    <Header :isCollapse="isCollapse"></Header>
    <div class="main-dashboard">
      <div class="topbar">
        <h5 style="margin: 0; cursor: pointer;" @click="handleCollapseNavbar()">
          <i class="el-icon-more-outline"></i>
        </h5>
        <div style="margin-right: 1rem">
          <!-- <el-switch
            v-model="darkTheme"
            @change="changeTheme()"
            style=" right: 15px; bottom: 2px"
            active-color="#443355"
            inactive-color="#d4ecf0">
          </el-switch> -->
          <el-dropdown trigger="click" @command="handleCurrentLanguage" class="dropdown-langs">
            <span class="el-dropdown-link">
            <span style="padding: 5px">{{currentLanguage}}</span><i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="en">EN</el-dropdown-item>
                <el-dropdown-item command="vi">VI</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" @command="handleClickItem">
            <span class="el-dropdown-link">
              <img class="avatar" :src="myAccount.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'">
              <span style="padding: 5px">{{myAccount.fullName}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="editInfo">{{lang.editInfo}}</el-dropdown-item> -->
                <el-dropdown-item style="padding-bottom: .2em" command="info"> <i class="el-icon-user-solid"></i> Thông tin </el-dropdown-item>
                <el-dropdown-item style="padding-bottom: .2em" command="logout"> <i class="fas fa-sign-out-alt"></i> {{lang.logout}}</el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <transition name="zoom-fade" mode="out-in">
        <router-view />
      </transition>
    </div>
    <DialogInfoUser v-if="showDialog" :dialogVisible="showDialog" @handleClose="showDialog = false" />
  </div>
</template>

<script>
import Header from "./components/Header/header";
import {mapGetters, mapActions} from 'vuex'
import ENUM from "const/api";
import DialogInfoUser from './dialogInfoUser.vue';
const { CATEGORIES, USERS } = ENUM
export default {
  data: function(){
    return {
      isCollapse: false,
      currentLanguage: localStorage.getItem('lang') && localStorage.getItem('lang').toUpperCase() == 'EN' ? 'EN' : 'VI',
      showDialog: false,
      darkTheme: false,
    }
  },
  components: {
    Header,
    DialogInfoUser,
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
      CHANGE_USER_INFO_DETAIL: '_HOMEPAGE/CHANGE_USER_INFO_DETAIL',
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
        let user_info = JSON.parse(localStorage.getItem('_info')) || {}
        this.socket.emit("USER_DISCONNECTED", {
          id: user_info.id,
          manager_id: user_info.manager_id,
          socketId: this.socket.id,

          // notice to bot telegram
          fullName: user_info.fullName,
        });

        this.postAPI(USERS.LOGOUT, {}, _ => { } )
        this.CHANGE_POSTS([])
        this.CHANGE_USERS([])
        this.CHANGE_REPORTS([])
        this.CHANGE_MY_ACCOUNT({})
        this.CHANGE_TOTAL_POSTS(0)
        this.$router.push('/admin/login').catch(()=>{})
        localStorage.clear()
      } else if (name == 'info') {
        // this.CHANGE_USER_INFO_DETAIL()
        this.showDialog = true
      }
    },
    changeTheme() {
      let body = document.querySelector('body') 
      if(this.darkTheme) body.classList.add("dark-theme")
      else body.classList.remove("dark-theme")
      localStorage.setItem("dark-theme" , JSON.stringify(this.darkTheme))
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

    let dark_theme = JSON.parse(localStorage.getItem("dark-theme"))
    this.darkTheme = dark_theme ? true : false
    // this.changeTheme()
    if(this.$route.path == '/admin/dashboard' || this.$route.path == '/admin/dashboard/'){ 
      this.$router.push('/admin/dashboard/posts').catch(()=>{})
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
        border-radius: 4px;
        margin-right: 1.5em;
      }
    }
    
    .main-dashboard {
      height: 100vh;
      width: 100%;
      overflow-y: auto;
    }

    img.avatar {
      width: 30px;
      height: 30px;
      min-width: 30px;
      border-radius: 50%;
    }
  }
</style>
