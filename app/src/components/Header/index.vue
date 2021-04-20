<template>
  <header>
    <!-- top-bar -->
    <div class="top-bar">
        <div class="container">
            <el-row :gutter="24">
                <el-col :md="16" :xs="24" v-if="responsive.isDesktop">
                    <ul class="top-nav">
                        <li>
                            <el-input placeholder="Nhập để tìm kiếm..." v-model="textSearch" @keypress.native.enter="search()" size="small">
                                <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                            </el-input>
                        </li>
                    </ul>
                </el-col>
                <el-col :md="8" :xs="24">
                    <span style="padding-left: .2rem">{{date}}</span>
                    <!-- <el-row>
                        <el-col :md="13"> {{date}} </el-col>
                        <el-col :md="6">
                            <el-dropdown trigger="click" @command="handleCurrentLanguage" style="color:#333;border: 1px thin;border-radius: 4px; padding: 0 .2rem">
                                <span class="el-dropdown-link">
                                <span style="padding: 5px">{{currentLanguage}}</span><i class="el-icon-arrow-down el-icon--right"></i></span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="en">EN</el-dropdown-item>
                                        <el-dropdown-item command="vi">VI</el-dropdown-item>
                                    </el-dropdown-menu>
                            </el-dropdown>    
                        </el-col>   
                    </el-row> -->
                </el-col>
            </el-row>
        </div>
    </div>
    <!-- middle-area -->
    <div class="middle-area">
        <div class="container">
            <el-row type="flex" align="middle" justify="space-around">
                <el-col :md="5">
                    <div class="logo-area">
                        <router-link to="/">
                            <img class="img-fluid" src="https://news.laptrinhmaytinh.com/static/images/logo.png">
                        </router-link>
                    </div>
                </el-col>
                <el-col :md="15">
                    <div class="banner-img text-right">
                        <a href="/" target="_blank">
                            <img class="img-fluid" src="https://news.laptrinhmaytinh.com/static/images/homepage/header_banner.png">
                        </a>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>

    <!--  -->
    <div class="header header-gradient">
        <div>
            <div class="container">
                <div class="categories">
                    <div v-if="!responsive.isDesktop">
                        <el-button v-if="isShowButtonShowCategories" size="small" icon="el-icon-menu" type="primary" @click="showCategories(true)"></el-button>
                        <el-button class="btn-x" v-else size="small" type="danger" @click="showCategories(false)">X</el-button>
                    </div>
                    <ul>
                        <!-- <li><a href="#">TECHNOLOGY</a>
                            <ul class="sub-main">
                                <li>FRONT-END</li>
                                <li>BACK-END</li>
                            </ul>
                        </li> -->
                        <li v-for="i in categories" :key="i.id">
                            <router-link :to="{path: '/category/' + i.url }" :title="i.name.toUpperCase()">{{i.name.toUpperCase()}}</router-link>
                        </li>
                    </ul>
                </div>
    
                <div class="btn-search" v-if="isShowButtonShowCategories">
                    <!-- <div class="d-flex">
                        <input type="text" name="q" placeholder="Tìm bài viết ở đây...">
                        <div class="btn"><i class="fas fa-search"></i></div>
                    </div> -->
                     <el-input v-if="!responsive.isDesktop" placeholder="Nhập để tìm kiếm..." v-model="textSearch" @keypress.native.enter="search()" size="small">
                        <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
                    </el-input>
                </div>

            </div>
        </div>
    </div>
  </header>
</template>

<script>
import CONST from 'const/const'
export default {
  data() {
    return {
      defaultLayout: "/",
      isShowSearch: false,
      date: '',
      textSearch: '',
      isShowButtonShowCategories: true,
      currentLanguage: localStorage.getItem('lang') && localStorage.getItem('lang').toUpperCase() == 'EN' ? 'EN' : 'VI' 
    }
  },
  methods: {
    showCategories(isShow) {
        let getTag = document.querySelector('.header-gradient')
        if(isShow) {
            getTag.classList.add('show')
            this.isShowButtonShowCategories = false
            return;
        }
        getTag.classList.remove('show')
        this.isShowButtonShowCategories = true
    },
    handleSelect(key, keyPath) {
      if (location.pathname !== key) this.$router.push(key);
    },
    handleCurrentLanguage(language){
      this.storeVue('_LANGUAGES').dispatch('CHANGE_LANGUAGES', language)
      this.currentLanguage = language.toUpperCase()
      localStorage.setItem('lang', language)
    },
    search(){
        if(!this.textSearch || this.$route.query.q == this.textSearch) return this.textSearch = '';
        this.$router.push(`/search/?q=${this.textSearch}`)
        this.textSearch = ''
    }
  },
  created(){
      setInterval(() => {
        this.date = CONST.dateInTopBar(new Date())
      }, 1000);
  },
  computed: {
    categories(){
      return this.storeVue("_CATEGORIES").getters.categories
    },
    responsive(){
      return this.storeVue("_HOMEPAGE").getters.responsive
    }
  }
};
</script>
<style lang="scss">
/* HEADER */
header {
    // top-bar
    .top-bar{
        background:whitesmoke;
        .el-row {
            display: flex;
            align-items: center;
        }

        .top-nav {
            display: inline-block;
            list-style-type: none;
            padding: 5px 0;
            margin: 0;
        
            li {
                display: inline-block;
                padding: 4px 10px;
                font-size: 14px;
                a {
                    color: #222;
                    line-height: 35px;
                    font-weight: 400;
                }
            }
        }
    }
    // middle-area
    .middle-area {
        padding: 20px 0;
    }
    // header
    .header {
        min-height: 70px;
        background-image: linear-gradient(20deg,#f84270 0%,#fe803b 100%);
        
        /* - scroll ----
            position: fixed;
            top: 0;
            left: 0;
            z-index: 999;
            width: 100%;
        */
        .categories {
            ul {
                li {
                    position: relative;
                    display: inline-block;
                    height: 100%;
                    min-height: 70px;
                    line-height: 70px;
                    margin-right: 8px;
                    padding: 0 18px;
                    font-weight: bold;
                    cursor: pointer;
                    a {
                        color: #ebebeb
                    }
                    &:hover {
                        background: #ffffff1a;
                        a {
                            color: white
                        }

                        ul.sub-main {
                            display: block;
                            position: absolute;
                            min-width: 250px;
                            // background: #eee;
                            z-index: 999;
                        }
                    }
                }
                ul.sub-main {
                    display: none;
                    border-radius: 4px;
                    background: transparent;
                   li {
                       transition: all .2s;
                       width: 100%;
                       border-radius: 4px;
                       background: #eee;

                       &:hover {
                        // background: rgb(184, 184, 184);
                        color: whitesmoke;
                        background: #fc4c00;
                       }
                       
                   }
                }
            }
        }
    }

}

</style>