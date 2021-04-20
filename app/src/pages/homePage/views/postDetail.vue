<template>
  <div id="post-detail" class="container" v-loading.fullscreen.lock="!visible">
    <h2 class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">Trang Chủ</el-breadcrumb-item>
        <el-breadcrumb-item>{{getCategoryById(detail.category_id).name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </h2>

    <el-row :gutter="24">
      <el-col :md="15" >
        <!-- LEFT -->
        <div class="title-meta">
            <h2>{{detail.title}}</h2>
            <div class="meta">
                <span class="category" :style="`background: ${getCategoryById(detail.category_id).color}`">{{getCategoryById(detail.category_id).name}}</span>
                <span class="date-time"> <i class="el-icon-time"></i> {{convertDate(detail.dateCreated)}}</span>
            </div>
        </div>
        <el-image v-if="detail.image" :src="detail.image" :fit="'cover'" style="display: block; box-shadow: #0000008c 0px 10px 20px; margin:1rem 0 1.5rem 0"></el-image>
        <div v-html="detail.content" class="content"></div>
        <!-- FORM REPORT -->
        <div class="report-post">
          <el-button v-if="!isShowFormReport" type="warning" plain icon="el-icon-warning-outline" @click="isShowFormReport = true">Báo cáo bài viết này</el-button>
          <div v-if="isShowFormReport">
            <el-divider content-position="left">Báo cáo bài viết này</el-divider>
            <el-row :gutter="24" type="flex" justify-content="space-around">
              <el-col :md="12">
                <el-input placeholder="Tiêu đề của báo cáo" size="large" v-model="form.title">
                  <template slot="prepend">Tiêu đề</template>
                </el-input>
              </el-col>
              <el-col :md="12">
                <el-input placeholder="Nhập email của bạn" size="large" v-model="form.email">
                  <template slot="prepend">Email</template>
                </el-input>
              </el-col>
            </el-row><br/>
            <el-input type="textarea" :rows="4" placeholder="Nội dung của bạn về bài viết không đúng, sai chính tả, gây mâu thuẫn ..." v-model="form.content"></el-input>
          </div>
          <div style="margin-top: 1rem">
            <el-button v-if="isShowFormReport" type="primary" plain @click="submitFormReport()">Gửi</el-button>
            <el-button v-if="isShowFormReport" type="danger" plain @click="isShowFormReport = false">Hủy</el-button>
          </div>

        </div>
        <!-- FB -->
        <!-- <div v-if="$route.params.category_url && $route.params.post_url">
          <div class="fb-like" :data-href="'https://news.laptrinhmaytinh.com/post/' + $route.params.category_url + '/' + $route.params.post_url" data-layout="button_count" data-action="like" data-size="small" data-share="true"></div>
          <div class="fb-comments" :data-href="'https://news.laptrinhmaytinh.com/post/' + $route.params.category_url + '/' + $route.params.post_url" data-numposts="10" data-mobile="Auto-detected" data-width="100%"></div> 
        </div> -->
        <div class="related-post">
          <TextAngleSharp title="Bài viết liên quan" style="margin-bottom: 1rem"/>
          <el-row :gutter="24">
            <el-col :md="8" v-for="post in topPosts" :key="post.id + Math.random().toString(36)">
              <Box :data="post" small :height="200"/>
            </el-col>
          </el-row>
        </div>
        <div class="dont-miss"></div>
      </el-col>

      <!-- RIGHT -->
      <el-col :md="8">
        <aside v-if="topNewFeed[0] && topPostsOfWeek[0]">
          <TextHeading :title="'TOP'" color="red"/>
          <Box :data="topNewFeed[0]" large :style="responsive.isDesktop ? 'padding: 0 0 1rem .5rem': ''" />
          <Box :data="post" mini :height="80" v-for="post in topNewFeed.filter((i, index) => index != 0)" :key="post.id + Math.random().toString(36)"/>

          <TextHeading :title="'Top của tuần'" color="red"/>
          <Box :data="topPostsOfWeek[0]" large :style="responsive.isDesktop ? 'padding: 0 0 1rem .5rem': ''" />
          <Box :data="post" mini :height="80" v-for="post in topPostsOfWeek.filter((item, index) => index != 0)" :key="post.id + Math.random().toString(36)" />
        </aside>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Box from "components/box-post";
import BoxCategory from "components/box-category";
import TextHeading from "components/text-heading";
import TextAngleSharp from "components/text-angle-sharp";
import ENUM from 'const/api'
const { POSTS } = ENUM

import CONST from 'const/const'
export default {
  data() {
    return {
      detail: {},
      visible: false,
      form: {
        title: '',
        email: '',
        content: ''
      },
      isShowFormReport: false,
      topPosts: []
    };
  },
  components: {
    Box,
    TextHeading,
    TextAngleSharp,
    BoxCategory,
  },
  created() {
    let { category_url, post_url } = this.$route.params
    // tìm xem trong store có data này chưa
    let getTopPosts = this.highlightPost.find(i => i.category_url == category_url)
    // các trường gọi lên server
    let d = { category_url, post_url, isNewCategory: getTopPosts ? false : true }

    this.getAPI(POSTS.GET_CONTENT, d, r => {
      const { ok , data, related_post } = r
      if(!ok || !data) return this.$router.push('/404');
      this.detail = data
      if(!getTopPosts) {
        let highlight = { category_id: data.category_id, category_url: category_url, related_post }
        this.storeVue('_POST_DETAIL').dispatch('CHANGE_HIGHLIGHT_POSTS', [...this.highlightPost, highlight])
        this.topPosts = related_post.map(i => ({...i, category: this.getCategoryById(data.category_id)}))
      } else this.topPosts = getTopPosts.related_post.map(i => ({...i, category: this.getCategoryById(getTopPosts.category_id)}))
      this.visible = true
    });
  },
  methods: {
    getCategoryById(id){
      if(!id) return {}
      let category = this.categories.find(i => i.id == id)
      return category || { url: '#', name: '', color: '#da1793' }
    },
    convertDate(timestamp) {
      return CONST.convertDate(0, Number(timestamp))
    },
    submitFormReport(){
      const { id } = this.detail
      const { title, email, content } = this.form
      if(!id || !title || !email || !content) return this.$message({ message: 'Vui lòng điền đẩy đủ thông tin', type: 'Error' })
        this.$confirm('Bạn có chắc chắn muốn gửi báo cáo tới admin', 'Warning', {
          confirmButtonText: 'Đồng ý gửi',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }).then(() => {
          this.postAPI(REPORTS.CREATE, { post_id: id, title, email, content }, r => {
            if(!r.ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
            this.$message({ message: 'Cảm ơn bạn đã báo cáo cho chúng tôi', type: 'success' })
            this.isShowFormReport = false
            this.resetForm()
          })
        }).catch(() => '')
    },
    resetForm(){
      this.form = {}
    }
  },
  computed: {
    home(){
      return this.storeVue('_HOMEPAGE').getters.home || []
    },
    topNewFeed(){
      return this.home.topNewFeed.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})).filter((i,index)=> index < 3)
    },
    topPostsOfWeek(){
      return this.home.topPostsOfWeek.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    cacheContent(){
      return this.storeVue('_POST_DETAIL').getters.cacheContent;
    },
    highlightPost(){
      return this.storeVue('_POST_DETAIL').getters.highlightPost
    },
    categories(){
      return this.storeVue('_CATEGORIES').getters.categories;
    },
    responsive(){
      return this.storeVue("_HOMEPAGE").getters.responsive || {}
    }
  },
  watch: {
    '$route.params': function(currentParams) {
      this.visible = false
      const { category_url, post_url } = currentParams
      // tìm xem trong store có data này chưa
      let getTopPosts = this.highlightPost.find(i => i.category_url == category_url)
      // các trường gọi lên server
      let d = { category_url, post_url, isNewCategory: getTopPosts ? false : true }
      this.getAPI(POSTS.GET_CONTENT, d, r => {
        const { ok , data, related_post } = r
        if(!ok || !data) return this.$router.push('/404')
        this.detail = data
        if(!getTopPosts) {
          let highlight = { 
            category_id: data.category_id,
            category_url: category_url,
            related_post
          }
          this.storeVue('_POST_DETAIL').dispatch('CHANGE_HIGHLIGHT_POSTS', [...this.highlightPost, highlight])
          this.topPosts = related_post.map(i => ({...i, category: this.getCategoryById(data.category_id)}))
        } else this.topPosts = getTopPosts.related_post.map(i => ({...i, category: this.getCategoryById(getTopPosts.category_id)}))
        this.visible = true
      })
    },
    'detail.title': title => document.title = title
  },
};
</script>

<style lang="scss">
#post-detail {
    h2 {
        font-weight: bold;
        padding: 0;
    }
    .breadcrumb {
        margin: 1.5rem 0 1rem 0;
        background-color: transparent;
    }
    .not-p { // not padding
        padding: 0 !important;
    }
    .content {
        padding-right: 15px;

        p {
            font-size: 1rem;
        }
        img {
            width: 100%;
            margin: 1rem 0 2rem 0;
            border-radius: 4px;
            box-shadow: #0000008c 0px 10px 20px;
            display: block;
        }
    }

  .title-meta {
    margin-top: 1rem;
    .date-time {
        opacity: 0.8;
    }
    .category {
        padding: 3px 5px;
        margin: 0 0 5px 0;
        border-radius: 4px;
        display: inline-block;
        background: blue;
        color: white;
        font-weight: bold;
        margin-right: 20px;
    }
  }
  .report-post {
    margin: 2rem 0;
    textarea {
      max-height: 300px
    }
  }
}

@media only screen and (max-width: 500px){
  #post-detail {
    .content {
      padding-right: 0;
    }
  }
}
</style>