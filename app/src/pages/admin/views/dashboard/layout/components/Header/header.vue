<template>
    <div class="header-dashboard">
      <transition name="el-fade-in-linear">
        <el-menu :default-active="indexMenu" @select="handleChangeLayout" :collapse="isCollapse">
           <el-menu-item index="/admin/messages/">
            <i class="el-icon-s-comment"></i> 
            <span slot="title">{{lang.messenger}}</span>
          </el-menu-item>
          <el-menu-item index="/admin/dashboard/posts">
            <i class="el-icon-s-order"></i>
            <span slot="title">{{lang.postsManagement}}</span>
          </el-menu-item>
          <el-menu-item index="/admin/dashboard/categories" v-if="myAccount && myAccount.permission >= 3">
            <i class="el-icon-menu"></i>
            <span slot="title">{{lang.categoriesManagement}}</span>
          </el-menu-item>
          <el-menu-item index="/admin/dashboard/users" v-if="myAccount && myAccount.permission >= 2">
            <i class="el-icon-user-solid"></i>
            <span slot="title">{{lang.users}}</span>
          </el-menu-item>
          <el-menu-item index="/admin/dashboard/reports" v-if="myAccount && myAccount.permission >= 2">
            <i class="el-icon-warning"></i>
            <span slot="title">{{lang.reports}}</span>
          </el-menu-item>
          <el-menu-item index="/admin/dashboard/statistics" v-if="myAccount && myAccount.permission >= 3">
            <i class="el-icon-s-data"></i>
            <span slot="title">{{lang.statistic}}</span>
          </el-menu-item>
          <el-menu-item index="/admin/dashboard/userManual">
            <i class="el-icon-s-management"></i>
            <span slot="title">{{lang.userManual}}</span>
          </el-menu-item>
        </el-menu>  
       </transition>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        indexMenu : '',
      };
    },
    props: {
      isCollapse: Boolean,
      default: false
    },
    methods: {
      handleChangeLayout(indexMenu) {
        const path = location.pathname
        if(path == indexMenu) return;
        this.$router.push(indexMenu)
      }
    },
    computed:{
      myAccount(){
        return this.storeVue('_ACCOUNT').getters.myAccount
      },
    },
    created(){
      const path = location.pathname 
      if(path == '/admin/dashboard/') this.indexMenu = ''
      else this.indexMenu = path
    },
    watch: { },
  }
</script>

<style lang="scss">
  /* .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  } */
  .header-dashboard {
    height: 100vh;
    .el-menu {
      height: 100vh;
      overflow-y: auto;
      // padding-top: 2rem;
    }
  }
</style>
