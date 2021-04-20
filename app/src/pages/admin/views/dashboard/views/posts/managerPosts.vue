<template>
  <div id="manager-posts" v-loading.fullscreen.lock="isLoading">
    <el-table :data="posts" height="75vh">
      <el-table-column :label="lang.picture" width="150">
        <template slot-scope="scope">
          <el-image :src="scope.row.image" fit="contain" >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column :label="lang.title" width="180">
        <template slot-scope="{row}">
          <el-tooltip :content="row.title" placement="top-start">
            <p class="fix-line">{{ row.title }}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="lang.category" width="150">
          <template slot-scope="{row}">
            <span v-html="getCategoryById(row.category_id)"></span>
          </template>
      </el-table-column>
      <el-table-column :label="lang.description" width="150">
          <template slot-scope="{row}">
            <el-tooltip :content="row.description" placement="top-start">
              <p class="fix-line">{{ row.description }}</p>
            </el-tooltip>
          </template>
      </el-table-column>
      <el-table-column :label="lang.creator" width="150">
          <template slot-scope="{row}">{{ getAuthorById(row.user_id) || myAccount.fullName }}</template>
      </el-table-column>
      <el-table-column :label="lang.view" width="100">
          <template slot-scope="{row}">{{ row.view }}</template>
      </el-table-column>
      <el-table-column :label="lang.dateCreated">
          <template slot-scope="{row}">{{ convertTimestampToDate(row.dateCreated) }}</template>
      </el-table-column>
      <el-table-column> <!-- width="160" -->
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" :placeholder="lang.search" @keyup.enter.native="searchPost"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">{{lang.edit}}</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">{{lang.delete}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="totalPosts" @current-change="handleCurrentChange" :page-size="pageSize" style="text-align: center; margin-top: 1rem"></el-pagination>
    <PopupEditPost :visiable.sync="showPopupEdit" @handleClose="showPopupEdit = false" :id="idEditPost"/>
  </div>
</template>

<script>
import ENUM from 'const/api'
const { POSTS } = ENUM

import CONST from 'const/const'
import PopupEditPost from './popupEditPost'
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      search: '',
      cacheSearch: '',
      isLoading: false,
      showPopupEdit: false,
      idEditPost: ''
    }
  },
  components: { PopupEditPost },
  beforeCreate(){
    // let c = localStorage.getItem('_') 
    // if(!(c && c == '__')) return this.$router.push('/')
  },
  created(){
    this.isLoading = true
    this.getAPI(POSTS.GET_POSTS_BY_PERMISSION, { limit: 10 }, res => {
      if(!res.ok) return;
      this.CHANGE_POSTS(res.data)
      this.CHANGE_TOTAL_POSTS(res.total_posts)
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions({
      CHANGE_POSTS: '_POSTS/CHANGE',
      CHANGE_TOTAL_POSTS: '_POSTS/CHANGE_TOTAL',
      CHANGE_POSTS: '_POSTS/CHANGE',
      CHANGE_POSTS: '_POSTS/CHANGE',
    }),
    handleEdit(index, { id }){
      this.idEditPost = id
      this.showPopupEdit = true
    },
    handleDelete(index, row){
      const { posts, lang } = this
      const { id } = row

      this.$confirm(lang.warningDeletePost, 'Warning', {
          confirmButtonText: lang.ok,
          cancelButtonText: lang.cancel,
          type: 'warning'
        }).then(() => {
          this.deleteAPI(POSTS.DELETE, { id}, r => {
            const { ok } = r
            if(!ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
            let index = posts.findIndex(i => i.id == id)
            posts.splice(index, 1)
            this.$message({ type: 'success', message: 'Xóa thành công' })
            this.CHANGE_POSTS([...posts])
          })        
        }).catch(() => '')
    },
    handleCurrentChange(numPage) {
      this.isLoading = true
      const { pageSize } = this
      this.getAPI(POSTS.GET_POSTS_BY_PERMISSION, { limit: pageSize, from: pageSize * (numPage - 1) }, res => {
        if(!res.ok) return;
        this.currentPage = numPage
        this.CHANGE_POSTS(res.data)
        this.isLoading = false
      })
    },
    getCategoryById(id){
      if(!id) return ''
      let category = this.categories.find(i => i.id == id)
      return category ? `<span class="testing" style="background: ${category.color || '#000000'}">${category.name}</span>` : ''
    },
    getAuthorById(id){
      if(!id) return ''
      let user = this.users.find(i => i.id == id)
      return user ? user.fullName : ''
    },
    convertTimestampToDate(timestamp) {
      return CONST.convertDate(0, Number(timestamp))
    },
    searchPost(){
      if(this.search == this.cacheSearch) return;
      if(!this.search) {
        this.getAPI(POSTS.GET_POSTS_BY_PERMISSION, { limit: 10 }, res => {
        if(!res.ok) return;
        this.CHANGE_POSTS(res.data)
        this.CHANGE_TOTAL_POSTS(res.total_posts)
      })
      }
      this.getAPI(POSTS.SEARCH_BY_PERMISSION, { q: this.search }, r => {
        this.cacheSearch = this.search
        let { ok , data } = r
        if(!ok) return;
        this.CHANGE_POSTS(data)
        this.CHANGE_TOTAL_POSTS(8)
    })
    }
  },
  mounted() {
  },
  computed:{
    ...mapGetters({
      categories: '_CATEGORIES/categories',
      cacheContent: '_POST_DETAIL/cacheContent',
      posts: '_POSTS/posts',
      users: '_USERS/users',
      totalPosts: '_POSTS/totalPosts',
      myAccount: '_ACCOUNT/myAccount',
    }),
  },
  // updated: function () {
  //   this.$nextTick(function () {
  //     let div = document.querySelector('#manager-posts>div')
  //     if(div) div.setAttribute('style', 'overflow-y: scroll!important')
  //   })
  // }
};
</script>

<style lang="scss">
#manager-posts {
  .fix-line {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    margin: 0;
  }
  
  span.testing {
    display: inline-block;
    padding: 3px 5px;
    margin:.2rem .5rem;
    border-radius: 4px;
    color: white
  }
  .el-table__row {
    height: 100px
  }
}
</style>