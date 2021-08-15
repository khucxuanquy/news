<template>
  <div id="homePage" v-loading.fullscreen.lock="!visible">
    <el-main style="overflow: unset;">
        <section class="container new-feed">
          <el-row :gutter="24">
            <!-- <el-col :md="7">
               <TextHeading :title="'Trending'" color="red"/>
                <Box :data="posts" small :height="230" v-for="(posts, index) in trendingInWeek" :key="index" />
               </el-col> -->
            <el-col :md="16" :sm="24" :style="!responsive.isDesktop ? 'padding: 0 10px' : ''">
              <!-- img 800 x 300 px -->
              <el-carousel :height="responsive.isDesktop ? '300px' : '130px'" direction="vertical" trigger="click" :autoplay="true" :interval="3000" style="box-shadow: #00000033 0px 0px 20px; border-radius: 8px;"> 
                <el-carousel-item v-for="item in [1,2,3,4]" :key="item">
                  <div class="banner-event" :style="`background-image: url(https://doan.khucblog.com/static/images/qc${item}.jpg)`"></div>
                </el-carousel-item>
              </el-carousel>
            <!-- LEFT -->
            <div class="top-new">
              <TextHeading :title="'News'" color="#690aa0"/>
              <Box v-if="topNewFeed[0]" :data="topNewFeed[0]" large :height="responsive.isDesktop ? 400: 200"/>
              <Box  v-for="post in topNewFeed.filter((item, index) => index != 0)" :data="post" :key="post.id" medium :height="!responsive.isDesktop ? 130 : 200"/>
              <div class="view-more" style="text-align: center">
                <el-button style="margin: 1rem 0" @click="$router.push('/category/news').catch(() => {})">Xem Thêm</el-button>
              </div>
            </div>
            </el-col>
            <el-col :md="8" :sm="24" style="position: sticky; top: 60px">
              <!-- RIGHT -->
              <aside>
                <TextHeading :title="'Chủ đề'" />
                <BoxCategory :data="category" v-for="category in categories" :key="category.id"/>
                <!-- <el-carousel :interval="4000" :autoplay="true">
                  <el-carousel-item v-for="item in topNewFeed" :key="item.id + Math.random().toString(36)">
                    <div :style="`background-image: url(${item.image});background-size:contain; background-repeat: no-repeat; height: 100%;`">
                    </div>
                  </el-carousel-item>
                </el-carousel> -->
                <div v-if="topPostsOfWeek[0]" style="margin-top: 2.5em;">
                  <TextHeading :title="'Bản tin hot trong tuần'" color="red"/>
                  <Box :data="topPostsOfWeek[0]" large :style="responsive.isDesktop ? 'padding: 0 0 1rem .5rem' : ''" />
                  <Box :data="posts" mini :height="80" v-for="(posts, index) in topPostsOfWeek.filter((item, index) => index != 0)" :key="index" />
                </div>
                <!-- <iframe frameborder="0" width="100%" height="400px" src="https://webtygia.com/api/xang-dau?bgheader=9c27b0&colorheader=ffffff&padding=5&fontsize=13"></iframe> -->

                <!-- <img src="https://demo.themewinter.com/wp/digiqoles/wp-content/uploads/2020/07/sidebar_banner.png" style='margin: 1rem 0'> -->
                <div v-if="topPostsOfMonth[0]">
                  <TextHeading :title="'Bài viết của tháng'" color="red"/>
                  <Box :data="topPostsOfMonth[0]" large :style="responsive.isDesktop ? 'padding: 0 0 1rem .5rem' : ''" />
                  <Box :data="p" mini :height="80" v-for="(p, i) in topPostsOfMonth.filter((item, index) => index != 0)" :key="i+5"/>
                </div>
                <!-- <iframe frameborder="0" style="margin-top: 5em" height="520px" width="100%" src="https://webtygia.com/api/cong-cu-chuyen-doi-tien-te?maukhungketqua=fe803b&mauchuketqua=ffffff&sizechuketqua=20&fontsize=13&border=1&hienthamkhao=0"></iframe> -->
              </aside>
            </el-col>
          </el-row>
        </section>
        <section class="main-banner--ads">
          <div class="container">
            <img style="margin: 1rem 0" src="https://demo.themewinter.com/wp/digiqoles/wp-content/uploads/2020/07/banner_content_5.png">
          </div>
        </section>
        <section class="category-highlight">
          <div class="container">
          <el-row>
            <el-col :md="18" style="padding-right: 1em">
            <!-- <TextHeading :title="'Thời Tiết'" />
            <iframe src="https://khucxuanquy.github.io/weather2/" width="100%" frameborder="0"></iframe> -->
            <TextAngleSharp :title="'Thống kê Covid-19'" />
            <iframe src="https://ourworldindata.org/grapher/total-cases-covid-19?tab=map" width="100%" height="600px" frameborder="0"></iframe>
              <div v-for="(item, index) in sectionBottom" :key="index" >
              <TextAngleSharp :title="item.name" :color="item.color" class="mb-2" />
              <el-row>
                <el-col :md="12"> 
                  <Box :data="item.data[0]" large :height="230" />
                </el-col>
                <el-col :md="12">
                    <Box :data="post" mini :height="78" v-for="post in item.data.filter((i, index) => index != 0 )" :key="post.id" />
                </el-col>
              </el-row>
            </div>
            </el-col>
            <el-col :md="6" style="position: sticky; top: 60px">
              <TextHeading :title="'Gợi ý cho bạn'" />
              <Box :data="posts" large :height="200" v-for="(posts, index) in trendingInWeek" :key="index" />
              <!-- <BoxCategory :data="category" v-for="category in categories" :key="category.id"/> -->
            </el-col>
          </el-row>
          </div>
        </section>
    </el-main>
  </div>
</template>

<script>
import CONST from 'const/const'
import ENUM from "const/api";
import Box from "components/box-post";
import BoxCategory from "components/box-category";
import TextHeading from "components/text-heading";
import TextAngleSharp from "components/text-angle-sharp";
const { POSTS, STATISTICS  } = ENUM;
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    Box,
    TextHeading,
    TextAngleSharp,
    BoxCategory
  },
  data: function () {
    return {
      visible: false,
    };
  },
  created() {
    let params = { }
    if(!this.home.topNewFeed.length) params.topNewFeed = true
    if(!this.home.topPostsOfWeek.length) params.topPostsOfWeek = true
    if(!this.home.topPostsOfMonth.length) params.topPostsOfMonth = true
    if(!Object.entries(this.home.sectionBottom).length) params.sectionBottom = true

    if(Object.entries(params).length) {
      this.getAPI(POSTS.HOME, params, res => {
        if (!res.ok) return;
        this.CHANGE_DATA_HOME(res.data);
        this.visible = true;
      })
    } else this.visible = true
    if(!this.home.trendingInWeek.length) {
      // let suggestion = JSON.parse(localStorage.getItem('suggestion'))
      // let data = []
      // if(suggestion) {
      //   for (const key in suggestion) {
      //     data.push({
      //       label: key,
      //       value: suggestion[key]
      //     })
      //   }
      //   function swap(arr, i, j) {
      //     let temp = arr[i]
      //     arr[i] = arr[j]
      //     arr[j] = temp
      //   }

      //   let i = 1;
      //   while (i < data.length) {
      //     let currentValue = data[i].value
      //     let j = i - 1; // indexLeftArray
      //     // j >=0 -> fix data[-1], 
      //     while (j >= 0 && currentValue > data[j].value) {
      //       swap(data, j, j + 1)
      //       j -= 1;
      //     }
      //     i++;
      //   }
      //   data = data.filter((i, index) => index < 3)
      // }

      this.getAPI(STATISTICS.GET_TRENDING_IN_WEEK, { }, (res) => {
        if (!res.ok) return;
        this.CHANGE_DATA_HOME({ trendingInWeek: res.data });
        this.visible = true;
      }); 
    }
  },
  methods: {
    ...mapActions({
      CHANGE_DATA_HOME: "_HOMEPAGE/CHANGE_DATA_HOME"
    }),
    getCategoryById(id){
      if(!id) return {}
      let category = this.categories.find(i => i.id == id)
      return category || { url: '#', name: '', color: '#da1793' }
    },
    convertDate(timestamp) {
      return CONST.convertDate(0, Number(timestamp))
    }
  },
  computed: {
    ...mapGetters({
      home: '_HOMEPAGE/home',
      responsive: '_HOMEPAGE/responsive',
      categories: '_CATEGORIES/categories',
    }),
    topNewFeed(){
      return this.home.topNewFeed.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    trendingInWeek(){
      return this.home.trendingInWeek.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    topPostsOfMonth(){
      return this.home.topPostsOfMonth.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    topPostsOfWeek(){
      return this.home.topPostsOfWeek.map(i => ({...i, category: this.getCategoryById(i.category_id), dateCreated: this.convertDate(i.dateCreated)})) 
    },
    sectionBottom(){
      let { sectionBottom } = this.home
      return this.categories.filter((i, ii) => {
        return sectionBottom[i.id] && sectionBottom[i.id] && sectionBottom[i.id].length
      }).map(i => {
        let data = sectionBottom[i.id].map(post => ({...post, category: i, dateCreated: this.convertDate(post.dateCreated)}))
        return { color: i.color, name: i.name, url: i.url, data }
      })
    },
  },
};
</script>

<style lang="scss">
#homePage {
  .category-highlight,
  .main-banner--ads {
    .container {
      max-width: 1500px;
    }
  }
}
.new-feed {
  .banner-event {
    background: #475669;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>