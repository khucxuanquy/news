<template>
  <header>
    <!-- top-bar -->
    <div class="top-bar">
      <div class="container">
        <el-row :gutter="24">
          <el-col :md="20" :xs="24">
            <ul class="top-nav">
              <li>
                <div class="logo-area">
                  <router-link to="/">
                    <svg width="40px" height="40px" viewBox="0 0 80.000000 80.000000">
                        <g transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)" fill="inherit" stroke="none">
                        <path d="M86 671 c-14 -16 -16 -42 -14 -217 l3 -199 325 0 325 0 3 200 c3 194 2 201 -19 218 -19 15 -50 17 -314 17 -271 0 -293 -1 -309 -19z m601 -25 c4 -3 7 -85 7 -181 l1 -175 -25 -1 c-116 -4 -552 -1 -556 4 -7 7 -7 344 0 355 5 9 565 7 573 -2z"></path>
                        <path d="M26 222 c-3 -3 -6 -18 -6 -33 0 -59 11 -60 394 -57 380 3 369 1 364 63 l-3 30 -372 1 c-204 1 -374 -1 -377 -4z m714 -41 c0 -15 -28 -16 -354 -16 -239 1 -321 4 -324 13 -3 9 77 12 337 12 191 0 341 -4 341 -9z"></path>
                        <path d="M338 612 c-36 -3 -57 -25 -36 -38 13 -8 236 -9 244 -2 2 3 2 13 -2 22 -4 10 -18 16 -43 17 -20 0 -56 1 -81 2 -25 1 -61 1 -82 -1z"></path>
                        <path d="M153 595 c-8 -23 2 -28 58 -29 38 -1 53 3 60 15 11 21 -7 29 -67 29 -31 0 -46 -5 -51 -15z"></path>
                        <path d="M584 595 c-8 -21 2 -32 28 -29 13 1 27 3 31 3 5 1 7 9 5 18 -4 22 -57 28 -64 8z"></path>
                        <path d="M139 500 c-7 -5 -6 -12 4 -22 11 -10 36 -14 89 -13 83 2 105 9 88 29 -11 14 -160 18 -181 6z"></path>
                        <path d="M358 503 c-10 -3 -18 -10 -18 -18 0 -15 19 -21 86 -24 39 -2 53 1 58 14 3 9 0 18 -7 20 -20 7 -101 12 -119 8z"></path>
                        <path d="M523 503 c-7 -3 -13 -11 -13 -19 0 -15 1 -15 78 -18 58 -2 77 5 70 25 -4 13 -105 22 -135 12z"></path>
                        <path d="M143 394 c-3 -8 -2 -18 2 -22 8 -8 243 -7 252 1 3 3 3 13 -1 22 -8 22 -244 21 -253 -1z"></path>
                        <path d="M433 403 c-7 -2 -13 -11 -13 -19 0 -16 -6 -15 124 -17 74 -2 103 2 114 12 11 11 11 16 1 22 -14 8 -206 10 -226 2z"></path></g>
                    </svg>
                    <span> Tech News</span>
                  </router-link>
                </div>
              </li>
              <li>
                <el-input
                  placeholder="Nhập để tìm kiếm..."
                  v-model="textSearch"
                  @keypress.native.enter="search()"
                  size="small"
                  class="A"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="search()"
                  ></el-button>
                </el-input>
              </li>
            </ul>
          </el-col>
          <el-col :md="4" :xs="24">
              <div style="text-align: right;">
                <el-button v-if="!userInfo.id" type="info" plain round @click="$router.push('/home/login')">Đăng nhập</el-button>
                <el-dropdown v-else trigger="click" @command="handleClickItem">
                    <span class="el-dropdown-link">
                        <span style="padding: 5px"> <i class="el-icon-s-custom"></i> {{userInfo.fullName}}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item command="editInfo">{{lang.editInfo}}</el-dropdown-item> -->
                        <el-dropdown-item command="logout">{{lang.logout}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      textSearch: "",
    };
  },
  methods: {
    ...mapActions({
        CHANGE_USER_INFO: '_HOMEPAGE/CHANGE_USER_INFO'
    }),
    search() {
      if (!this.textSearch || this.$route.query.q == this.textSearch)
        return (this.textSearch = "");
      this.$router.push(`/search/?q=${this.textSearch}`);
      this.textSearch = "";
    },
    handleClickItem(command){
        if(command === 'logout') {
            this.CHANGE_USER_INFO({})
            localStorage.clear()
        }
    }
  },
  created() {
  },
  computed: {
    ...mapGetters({
        userInfo: '_HOMEPAGE/userInfo',
        responsive: '_HOMEPAGE/responsive',
    }),
  },
};
</script>
<style lang="scss">
/* HEADER */
header {
  // top-bar
  .top-bar {
    background: whitesmoke;
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
      .logo-area{
          svg {
            fill: black;
          }
          span {
            font-size: 1.3em;
            font-weight: bold;
            color: #222222;
            opacity: .8;
            position: relative;
            top: 2px;
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
    background-image: linear-gradient(20deg, #f84270 0%, #fe803b 100%);

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
            color: #ebebeb;
          }
          &:hover {
            background: #ffffff1a;
            a {
              color: white;
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
            transition: all 0.2s;
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