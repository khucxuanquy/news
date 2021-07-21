<template>
  <div id="category" v-loading.fullscreen.lock="visible">
    <el-main>
      <section class="container new-feed">
        <el-row :gutter="24">
          <!-- <el-col :md="7" :sm="24">
            <iframe src="https://khucxuanquy.github.io/weather2/" width="100%" height="250px" frameborder="0"></iframe>
            <iframe src="https://ourworldindata.org/grapher/total-cases-covid-19?tab=map" width="100%" height="600px" frameborder="0"></iframe>
            </el-col> -->
          <el-col :md="16" :sm="24">
          <!-- LEFT -->
          <div class="top-new">
            <TextHeading :title="getCategoryByUrl($route.params.category_url).name || 'News'" :color="getCategoryByUrl($route.params.category_url).color || '#690aa0'"/>
            <div v-if="postsByCategory[0]">
              <Box :data="postsByCategory[0]" large :height="responsive.isDesktop ? 400 : 200"/>
              <Box v-for="post in postsByCategory.filter((item, index) => index != 0)" :data="post" :key="post.id" medium :height="!responsive.isDesktop ? 130 : 200"/>
            </div>
            <div v-else>
              <h4 style="text-align: center; margin-top: 1rem">Không tìm thấy bài viết của chủ đề này</h4>
            </div>

            <div class="view-more" style="text-align: center">
              <el-button style="margin: 1rem 0" v-if="!noMore" @click="viewMore()">Xem Thêm</el-button>
            </div>
          </div>
          </el-col>
          <el-col :md="8" :sm="24">
            <TextHeading :title="'Chủ đề'" />
            <BoxCategory :data="category" v-for="category in categories" :key="category.id"/>
            <!-- RIGHT -->
            <aside v-if="topPostsOfWeek[0] && topPostsOfMonth[0]">
              <TextHeading :title="'Hot trong tuần'" color="red"/>
              <Box :data="topPostsOfWeek[0]" large :style="responsive.isDesktop ? 'padding: 0 0 1rem .5rem': ''" />
              <Box :data="posts" mini :height="80" v-for="(posts, index) in topPostsOfWeek.filter((item, index) => index != 0)" :key="index" />

              <TextHeading :title="'Hot trong tháng'" color="red"/>
              <Box :data="topPostsOfMonth[0]" large :style="responsive.isDesktop ? 'padding: 0 0 1rem .5rem': ''" />
              <Box :data="p" mini :height="80" v-for="(p, i) in topPostsOfMonth.filter((item, index) => index != 0)" :key="i+5"/>
            </aside>
          </el-col>
        </el-row>
      </section>
    </el-main>
</div>
</template>

<script>
import CONST from 'const/const'
import ENUM from 'const/api'
const { POSTS } = ENUM

import Box from "components/box-post";
import BoxCategory from "components/box-category";
import TextHeading from "components/text-heading";
import TextAngleSharp from "components/text-angle-sharp";
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      visible: true,
      limit: 10, // pageSize
      from: 0, // numPage
      currentCategory: '',
      noMore: false
    }
  },
  components: {
    Box,
    TextHeading,
    TextAngleSharp,
    BoxCategory
  },
  created() {
    let params = { }
    if(!this.home.topPostsOfWeek.length) params.topPostsOfWeek = true
    if(!this.home.topPostsOfMonth.length) params.topPostsOfMonth = true

    if(Object.entries(params).length) {
      this.getAPI(POSTS.HOME, params, res => {
        if (!res.ok) return;
        this.CHANGE_DATA_HOME(res.data);
      })
    }

    let { category_url } = this.$route.params
    let { from, limit } = this
    let d = { category_url, from, limit }
    this.getAPI(POSTS.GET_POSTS_BY_CATEGORY, d, r => {
      this.visible = false
      let { ok , data } = r
      if(!ok) return this.$router.push('/404')
      if(data.length < limit) this.noMore = true
      this.from += this.limit
      data = data.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)}))
      this.storeVue('_POST_DETAIL').dispatch('CHANGE_POSTS_BY_CATEGORY', data)
    })
  },
  methods: {
    ...mapActions({
      CHANGE_DATA_HOME: "_HOMEPAGE/CHANGE_DATA_HOME",
    }),
    getCategoryById(id){
      if(!id) return {}
      let category = this.categories.find(i => i.id == id)
      return category || { url: '#', name: '', color: '#da1793' }
    },
    getCategoryByUrl(url){
      if(!url) return {}
      let category = this.categories.find(i => i.url == url)
      return category || { url: '#', name: '', color: '#da1793' }
    },
    convertDate(timestamp) {
      return CONST.convertDate(0, Number(timestamp))
    },
    viewMore(){
      this.visible = true
      let { category_url } = this.$route.params
      let { from, limit } = this
      let d = { category_url, from, limit }
      this.getAPI(POSTS.GET_POSTS_BY_CATEGORY, d, r => {
        this.visible = false
        let { ok , data } = r
        if(!ok) return this.$router.push('/404')
        if(data.length < limit) this.noMore = true
        this.from += this.limit
        data = data.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)}))
        this.storeVue('_POST_DETAIL').dispatch('CHANGE_POSTS_BY_CATEGORY', [...this.postsByCategory, ...data])
      })
    }
  },
  computed: {
    home() {
      return this.storeVue("_HOMEPAGE").getters.home
    },
    topNewFeed(){
      return this.home.topNewFeed.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    topPostsOfMonth(){
      return this.home.topPostsOfMonth.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    topPostsOfWeek(){
      return this.home.topPostsOfWeek.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    categories() {
      return this.storeVue('_CATEGORIES').getters.categories;
    },
    postsByCategory(){
      return this.storeVue('_POST_DETAIL').getters.postsByCategory
    },
    responsive(){
      return this.storeVue('_HOMEPAGE').getters.responsive || {}
    }
  },
  watch: {
    '$route.params': function(currentParams) {
      this.noMore = false
      this.from = 0
      const { category_url } = currentParams
      let { limit, postsByCategory } = this
      let d = { category_url, from: 0, limit }
      // lấy bài viết theo chủ để
      this.getAPI(POSTS.GET_POSTS_BY_CATEGORY, d, r => {
        this.visible = false
        let { ok , data } = r
        if(!ok) return this.$router.push('/404')
        // nếu lấy bài viết từ server về mà length < limit => không hiển thị button 'Xem thêm'
        if(data.length < limit) this.noMore = true
        data = data.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)}))
         this.from += this.limit
        // let arrPostsByCategory = postsByCategory[0].category.url == category_url ? [...postsByCategory, ...data] : data
        this.storeVue('_POST_DETAIL').dispatch('CHANGE_POSTS_BY_CATEGORY', data)
      })
    },
  }
};
</script>

<style>

</style>