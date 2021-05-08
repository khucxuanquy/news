<template>
  <div id="statistics">
    <div class="overview-box">
      <h3>Số bài viết được xuất bản</h3>
      <el-row class="overview-box" type="flex" justify="space-between">
        <el-col :md="8">
          <div class="box-child">
            <span>Hôm nay </span>
            <strong>{{ overview.quantityInDate || 0 }}</strong>
          </div>
        </el-col>
        <el-col :md="8">
          <div class="box-child">
            <span> Tuần này </span
            ><strong>{{ overview.quantityInWeek || 0 }}</strong>
          </div>
        </el-col>
        <el-col :md="8">
          <div class="box-child">
            <span> Tháng này </span
            ><strong>{{ overview.quantityInMonth || 0 }}</strong>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- {{ overview.topEmployeesInWeek }}
    {{ overview.topEmployeesInMonth }} -->
    <div style="width: 50vw">
      <BoxChart
        v-if="
          filterCategoryMostInterest.labels.length &&
          filterCategoryMostInterest.datasets[0].data.length
        "
        :DATA="filterCategoryMostInterest"
        typeChart="pie"
      />
    </div>
    <BoxChart v-if="viewsByDatePicker" :DATA="viewsByDatePicker" typeChart="line" />
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
      selectDatePicker: '',
      pickerOptions: {
        shortcuts: [
          {
            text: 'Hôm nay',
            onClick(picker) {
              const end = +new Date().setMinutes(0,0,0);
              const start = new Date().setHours(0,0,0,0);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: 'Tuần qua',
            onClick(picker) {
              const start = new Date().setHours(0, 0, 0, 0) - ONE_DAY * 7;
              const end = new Date().setMinutes(0,0,0);
              picker.$emit('pick', [start, end]);
            }
          },
          // {
          //   text: 'Tháng qua',
          //   onClick(picker) {
          //     const end = new Date();
          //     const start = new Date();
          //     start.setTime(+start - ONE_DAY * 30);
          //     picker.$emit('pick', [start, end]);
          //   }
          // },
          
        ]
      },
    };
  },
  created() {
    if(this.overview.quantityInDate === null) {
      this.getAPI(POSTS.GET_OVERVIEW_STATISTICS, {}, (res) => {
        if (!res.ok) return; // error something
        this.CHANGE_OVERVIEW(res.data);
      });
    }

    if(!this.categoryMostInterest.length) {
      this.getAPI(STATISTICS.GET, {}, (res) => {
        if (!res.ok) return; // error something
        this.CHANGE_CATEGORY_MOST_INTEREST(res.data.categoryMostInterest);
      });
    }
  },
  components: {
    BoxChart,
  },
  methods: {
    ...mapActions({
      CHANGE_OVERVIEW: "_STATISTICS/CHANGE_OVERVIEW",
      CHANGE_CATEGORY_MOST_INTEREST: "_STATISTICS/CHANGE_CATEGORY_MOST_INTEREST",
      CHANGE_VIEWS_BY_DATE_PICKER: "_STATISTICS/CHANGE_VIEWS_BY_DATE_PICKER"
    }),
    getNameCategoryById(id) {
      if (!id) return "";
      let category = this.categories.find(i => i.id == id);
      return category && category.name ? category.name : "";
    },
    selectDatePiker(){
      this.CHANGE_VIEWS_BY_DATE_PICKER(null)
      // console.log(126, this.selectDatePicker)
      let { selectDatePicker } = this
      selectDatePicker[0] = new Date(selectDatePicker[0]).setHours(0,0,0,0)
      this.getAPI(STATISTICS.GET_BY_DATE_PICKER, {start: selectDatePicker[0], end: selectDatePicker[1]}, (res) => {
        if (!res.ok) return; // error something
        this.CHANGE_VIEWS_BY_DATE_PICKER(res.data)
      });
    }
  },
  computed: {
    ...mapGetters({
      categories: "_CATEGORIES/categories",
      overview: "_STATISTICS/overview",
      categoryMostInterest: "_STATISTICS/categoryMostInterest",
      viewsByDatePicker: "_STATISTICS/viewsByDatePicker",
    }),
    filterCategoryMostInterest() {
      let { categoryMostInterest } = this;
      return {
        labels: categoryMostInterest.map((i) => this.getNameCategoryById(i.category_id)).filter((i) => i),
        datasets: [
          {
            label: "Chủ đề",
            data: categoryMostInterest.map((i) => i.totalView),
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss">
#statistics {
  height: calc(100vh - 50px);
  overflow-y: auto;
  .overview-box {
    padding: 1em 2em 2em;
    background: lightskyblue;

    h3 {
      margin: 0 0 0.5em 0.6em;
      color: #000000a6;
    }
    .box-child {
      text-align: center;
      background: #e4e4e4;
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
      &:hover {
        background: #eee;
        strong {
          color: #5ec7c2;
        }
      }
      span {
        color: #333;
        font-size: 2em;
      }
      strong {
        color: #333;
        font-size: 5em;
      }
    }
  }
}
</style>