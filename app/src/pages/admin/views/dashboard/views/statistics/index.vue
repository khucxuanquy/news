<template>
  <div id="statistics" v-if="visiable">
    <div class="overview-box">
      <el-divider content-position="left"><h3> Thống kê </h3></el-divider>
      <el-row class="overview-box" type="flex" justify="space-between">
        <el-col :md="8">
          <div class="box-child" style="background: linear-gradient(45deg, #4099ff, #73b4ff)">
            <span>Tổng bài viết</span>
            <strong>{{ overview.totalPost || 0 }}</strong>
          </div>
        </el-col>
        <el-col :md="8">
          <div class="box-child" style="background: linear-gradient(45deg, #2ed8b6, #59e0c5)">
            <span> Lượt xem </span>
            <strong>{{ overview.totalView || 0 }}</strong>
          </div>
        </el-col>
        <el-col :md="8">
          <div class="box-child" style="background: linear-gradient(45deg, #FFB64D, #ffcb80)">
            <span> Tháng này </span
            ><strong>{{ overview.quantityInMonth || 0 }}</strong>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- {{ overview.topEmployeesInWeek }}
    {{ overview.topEmployeesInMonth }} -->
    <div class="overview-categories">
      <BoxChart
        style="width: 35%; padding: 1em 0; background: whitesmoke; box-shadow: 0 0 20px rgb(0 0 0 / 10%); border-radius: 15px;"
        v-if="categoryMostInterest"
        :DATA="categoryMostInterest"
        typeChart="pie"
        :title="'Thống kê lượt xem theo chủ đề trong tuần'"
      />
      <div style="flex: 1; max-width: 65%;">
        <BoxChart v-loading="loadStatisticCategories" v-if="statisticCategories" :DATA="statisticCategories" typeChart="bar" :title="'Thống kê lượt xem theo chủ đề'" />
        <div class="statistic-categories-details">
         
          <!-- SELECT CATEGORIES -->
          <el-select
            v-model="selectcategories"
            multiple
            collapse-tags
            placeholder="chọn chủ đề">
            <el-option
              v-for="i in categories"
              :key="i.id"
              :label="i.name"
              :value="i.id">
            </el-option>
          </el-select>

        <!-- SELECT RANGE DATE -->
          <el-date-picker
            v-model="selectDateToStatisticCategories"
            type="daterange"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            format="yyyy/MM/dd"
            value-format="timestamp"
            :picker-options="pickerOptions"
            >
          </el-date-picker>

          <!-- BUTTON SUBMIT OPTIONS -->
          <el-button type="primary" @click="getStatisticCategories()" plain circle icon="el-icon-search"></el-button>
        </div>
      </div>
    </div>
    <!-- RANKING -->
    <div class="overview-top-users">
       <div class="box-ranking" v-if="filterTopEmployees.inWeek.length">
        <el-divider>Top nổi bật trong Tuần</el-divider>
        <div class="child-box" v-for="(user, index) in filterTopEmployees.inWeek" :key="user.id">
          <div class="box-index">
            <span v-if="!index"><i class="el-icon-medal-1"></i></span>
            <span v-else>{{ index }}</span>
          </div>
          <div class="info">
            <img :src="user.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'">
            <div class="info-detail">
            <p class="name">{{user.fullName}}</p>
            <span class="position">{{user.position}}</span>
            </div>
          </div>
          <div class="meta">
            <p> <strong>{{ user.totalView }}</strong> lượt xem </p>
            <p> <strong>{{ user.amountPosts }}</strong> bài viết </p>
          </div>
        </div>
      </div>
      
      <div class="box-ranking" v-if="filterTopEmployees.inMonth.length">
        <el-divider>Top nổi bật trong Tháng</el-divider>
        <div class="child-box" v-for="(user, index) in filterTopEmployees.inMonth" :key="user.id">
          <div class="box-index">
            <span class="index" v-if="!index"><i class="el-icon-medal-1"></i></span>
            <span v-else>{{ index }}</span>
          </div>
          <div class="info">
            <img :src="user.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'">
            <div class="info-detail">
            <p class="name">{{user.fullName}}</p>
            <span class="position">{{user.position}}</span>
            </div>
          </div>
          <div class="meta">
            <p> <strong>{{ user.totalView }}</strong> <span> lượt xem </span> </p>
            <p> <strong>{{ user.amountPosts }}</strong> <span> bài viết </span> </p>
          </div>
        </div>
      </div>
    </div>
    <BoxChart v-loading="loadStatisticView" v-if="viewsByDatePicker" :DATA="viewsByDatePicker" typeChart="line" :title="'Biểu đồ số lượt xem của trang web'"/>
    <div class="form-select-date">
      <el-date-picker
        v-model="selectDatePicker"
        type="daterange"
        start-placeholder="Từ ngày"
        end-placeholder="Đến ngày"
        format="yyyy/MM/dd"
        value-format="timestamp"
        :picker-options="pickerOptions"
        @change="selectDatePiker"
        >
      </el-date-picker>
    </div>
  </div>
</template>

<script>
import BoxChart from "components/box-chart";
import ENUM from "const/api";
import { mapActions, mapGetters } from "vuex";
const { POSTS, STATISTICS } = ENUM;
const ONE_DAY = 24 * 60 * 60 * 1000;
export default {
  data() {
    return {
      visiable: false,
      selectDatePicker: [],
      pickerOptions: {
        shortcuts: [
          {
            text: 'Hôm nay',
            onClick(picker) {
              const end = new Date().setMinutes(0,0,0);
              const start = new Date().setHours(0,0,0,0);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '7 ngày qua',
            onClick(picker) {
              const start = new Date().setHours(0, 0, 0, 0) - ONE_DAY * 7;
              const end = new Date().setMinutes(0,0,0);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '30 ngày qua',
            onClick(picker) {
              const start = new Date().setHours(0, 0, 0, 0) - ONE_DAY * 30;
              const end = new Date().setMinutes(0,0,0);
              picker.$emit('pick', [start, end]);
            }
          },
        ]
      },
      selectDateToStatisticCategories: [],
      selectcategories: [],
      loadStatisticCategories: false,
      loadStatisticView: false,
    };
  },
  created() {
    if(this.myAccount.permission <= 2) return this.$router.push('/admin/dashboard')
    else this.visiable = true;

    const start = new Date().setHours(0, 0, 0, 0) - ONE_DAY * 7;
    const end = new Date().setMinutes(0,0,0);
    this.selectDateToStatisticCategories = [start, end]
    this.selectDatePicker = [start, end]
    
    if(this.overview.quantityInDate === null) {
      this.getAPI(POSTS.GET_OVERVIEW_STATISTICS, {}, (res) => {
        if (!res.ok) return; // error something
        this.CHANGE_OVERVIEW(res.data);
      });
    }

    // overview - categories
    if(!this.categoryMostInterest) {
      this.getAPI(STATISTICS.GET, {}, res => {
        let { ok, data } = res
        if (!ok) return; // error something
        data.categoryMostInterest = {
          labels: data.categoryMostInterest.map(i => this.getNameCategoryById(i.category_id)).filter(i => i),
          datasets: [
            {
              label: "Chủ đề",
              data: data.categoryMostInterest.map(i => i.totalView || 0),
            },
          ],
        }
        if(!data.categoryMostInterest.labels.length) {
          data.categoryMostInterest.labels = ['Tin Tức']
          data.categoryMostInterest.datasets = [{
            label: "Chủ đề",
            data: [1]
          }]
        }
        this.CHANGE_CATEGORY_MOST_INTEREST(data.categoryMostInterest);
      });
    }

    if(!this.statisticCategories) this.getStatisticCategories();
    if(!this.viewsByDatePicker) this.selectDatePiker();
  },
  components: {
    BoxChart,
  },
  methods: {
    ...mapActions({
      CHANGE_OVERVIEW: "_STATISTICS/CHANGE_OVERVIEW",
      CHANGE_CATEGORY_MOST_INTEREST: "_STATISTICS/CHANGE_CATEGORY_MOST_INTEREST",
      CHANGE_VIEWS_BY_DATE_PICKER: "_STATISTICS/CHANGE_VIEWS_BY_DATE_PICKER",
      CHANGE_STATISTIC_CATEGORIES: "_STATISTICS/CHANGE_STATISTIC_CATEGORIES",
    }),
    getNameCategoryById(id) {
      if (!id) return "";
      let category = this.categories.find(i => i.id == id);
      return category && category.name ? category.name : "";
    },
    selectDatePiker(){
      let { selectDatePicker } = this
      if(!selectDatePicker.length) return;
      selectDatePicker[0] = new Date(selectDatePicker[0]).setHours(0,0,0,0)
      if(+new Date() - selectDatePicker[0] > ONE_DAY) selectDatePicker[1] = new Date(selectDatePicker[1]).setHours(24,0,0,0);
      if(selectDatePicker[0] === selectDatePicker[1]) return;
      // loading
      this.loadStatisticView = true;
      this.getAPI(STATISTICS.GET_BY_DATE_PICKER, {start: selectDatePicker[0], end: selectDatePicker[1]}, (res) => {
        if (!res.ok) return; // error something
        this.CHANGE_VIEWS_BY_DATE_PICKER(null)
        this.$nextTick(() => {
          this.CHANGE_VIEWS_BY_DATE_PICKER(res.data)
          this.loadStatisticView = false
        })
      });
    },
    /**
     *@ selectDateToStatisticCategories()
     */
    getStatisticCategories() {
      const { selectDateToStatisticCategories: rangeDate, selectcategories } = this
      if(!rangeDate || !rangeDate.length) return;
      this.loadStatisticCategories = true;
      rangeDate[0] = new Date(rangeDate[0]).setHours(0,0,0,0)
      if(+new Date() - rangeDate[0] > ONE_DAY) rangeDate[1] = new Date(rangeDate[1]).setHours(24,0,0,0);
      if(rangeDate[0] === rangeDate[1]) return;
      this.getAPI(STATISTICS.STATISTIC_CATEGORY, {start: rangeDate[0], end: rangeDate[1], categoryIds: selectcategories}, res => {
        let { ok , data } = res
        if (!ok) return; // error something
        data.datasets = data.datasets.map(i => ({...i, label: this.getNameCategoryById(i.label)}))
        this.CHANGE_STATISTIC_CATEGORIES(null)
        this.$nextTick(() => {
          this.CHANGE_STATISTIC_CATEGORIES(data)
          this.loadStatisticCategories = false;
        })
      });
    },
    getPositionName(permission){
      if(permission === 3) return 'Admin';
      if(permission === 2) return this.lang.manage;
      return this.lang.staff;
    },
    /**
     *@ only get avatar, fullName
     */
    getEmployeesById(id) {
      if(id === this.myAccount.id) return { avatar: this.myAccount.avatar, fullName: this.myAccount.fullName, position: this.getPositionName(this.myAccount.permission) }
      let user = this.users.find(user => user.id === id)
      return user ? { avatar: user.avatar, fullName: user.fullName, position: this.getPositionName(user.permission) } : { }
    }
  },
  computed: {
    ...mapGetters({
      myAccount: "_ACCOUNT/myAccount",
      categories: "_CATEGORIES/categories",
      overview: "_STATISTICS/overview",
      categoryMostInterest: "_STATISTICS/categoryMostInterest",
      statisticCategories: "_STATISTICS/statisticCategories",
      viewsByDatePicker: "_STATISTICS/viewsByDatePicker",
      users: "_USERS/users",
    }),
    filterTopEmployees() {
      let { users, overview } = this
      if(!users.length) return { inWeek: [], inMonth: [] };
      let inWeek = overview.topEmployeesInWeek.map(i => ({...i, ...this.getEmployeesById(i.user_id)})) || [];
      let inMonth = overview.topEmployeesInMonth.map(i => ({...i, ...this.getEmployeesById(i.user_id)})) || [];
      inMonth = inMonth.sort((a,b) =>  b.totalView - a.totalView)
      inWeek = inWeek.sort((a,b) =>  b.totalView - a.totalView)
      if(!inWeek.length) inWeek = this.users.filter((i, index) => index < 6).map(i => ({...i, amountPosts: 0, totalView: 0 }))
      if(!inMonth.length) inWeek = this.users.filter((i, index) => index < 6).map(i => ({...i, amountPosts: 0, totalView: 0 }))
      return { inWeek, inMonth }
    }
  },
};
</script>

<style lang="scss">
@mixin text-gradient {
  color: transparent;
  background-image: linear-gradient(45deg, #2ed8b6, #59e0c5);
  -webkit-background-clip: text;
}
$shadow: 0 16px 24px 2px #00000024, 0 6px 30px 5px #0000001f, 0 8px 10px -5px #00000033;
$shadow2: #0000001a 0px 0px 20px;

#statistics {
  height: calc(100vh - 50px);
  overflow-y: auto;
  background:  #eee;

  .el-divider__text {
    background: #eee;
  }
// 1
  .overview-box {
    padding: 1em .5em 2em;
    background: transparent;

    h3 {
      margin: 0 0 0.5em 0.6em;
      color: #000000a6;
      background: transparent;
    }
    .box-child {
      text-align: center;
      color: #333;
      min-height: 100px;
      margin: 0 1em;
      padding: 0 1em;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 8px;
      user-select: none;
      transition: all 0.2s linear;
      box-shadow: $shadow2;

      strong {
        transition: all 0.2s;
      }
      &:hover {
        strong {
          color: white;
        }
      }
      span {
        color: #333;
        font-size: 2em;
      }
      strong {
        color: #424242;
        font-size: 5em;
      }
    }
  }

// 2
  .overview-categories {
    display: flex;
    justify-content: space-evenly;
    padding: 0 2em;
    gap: 1em;

    .statistic-categories-details {
      *:not(button) {
        background: transparent;
      }
      &>*{
        margin-right: .5em;
      }
    }
  }

// 3
  .overview-top-users {
    margin-top: 2em;
    padding: 1em;
    display: flex;
    justify-content: space-evenly;

    &>div {
      width: calc(50% - 2em);
    }
    .box-ranking {
      box-shadow: $shadow2;
      border-radius: 20px;
      padding: .75em 1em;
      background:whitesmoke;
      .el-divider__text {
        background: whitesmoke;
      }
      .child-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1em;

        .box-index {
          margin-right: 1.5em;
          width: 1em;
          span {
            display: inline-block;
            transform: scale(1.5);
            color: #00000080;
            font-weight: bold;
          }
        }

        .info {
          display: flex;
          position: relative;
          align-items: center;
          flex: 1;

          .info-detail {
            padding-left: 1em;
            .name {
              margin-bottom: .2em;
              font-weight: bold;
              @include text-gradient;
              
            }
            .position {
              opacity: .5;
            }
          }

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: contain;
            background: #dbdbdb;
          }

        }

        .meta {
          p {
            margin: .25em 0;
            strong {
              @include text-gradient;
            }
            span {
              opacity: .75;
            }
          }
        }

        &:hover {
          .info-detail {
            .name {
              background-image: linear-gradient(45deg, #ffb64d, #ffcb80);
            }
          }
        }
      }
    }
  }
}
</style>