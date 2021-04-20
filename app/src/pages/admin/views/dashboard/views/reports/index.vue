<template>
  <div id="reports-dashboard" :visiabled="visiabled" v-loading.fullscreen.lock="isLoading">
    <el-table :data="reports" style="width: 100%" @expand-change="onShowContent">
      
      <el-table-column type="expand">
        <template slot-scope="props">
          <p>{{lang.post}}: <strong>{{ props.row.post_title }} </strong> </p>
          <p>{{lang.reportName}}: <strong>{{ props.row.title }} </strong> </p>
          <p>{{lang.email}}: <strong>{{ props.row.email }}</strong> </p>
          <p> {{ props.row.content }} </p>
        </template>
      </el-table-column>

      <el-table-column :label="lang.post">
        <template slot-scope="{row}">
          <el-tooltip :content="row.post_title" placement="top-start">
            <p class="fix-line">{{ row.post_title }}</p>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column :label="lang.reportName" prop="title"></el-table-column>

      <el-table-column :label="lang.email" prop="email"></el-table-column>

      <el-table-column :label="lang.dateCreated">
        <template slot-scope="{row}">
          {{convertTimestampToDate(row.dateCreated)}}
        </template>
      </el-table-column>

      <el-table-column> <!-- width="160" -->
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{lang.delete}}</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import ENUM from 'const/api'
const { REPORTS } = ENUM

import CONST from 'const/const'
export default {
  data() {
    return {
      visiabled: false,
      isLoading: true
    }
  },
  components: {  },
  beforeCreate() {
    if(!localStorage.getItem('_u')) return this.$router.push('/admin/login');
  },
  created(){
    if(this.reports.length) this.isLoading = false
    if(this.myAccount.permission >= 2) this.visiabled = true
    if(!this.reports.length) {
      this.getAPI(REPORTS.GET_REPORTS, { }, res => {
        const { ok, data } = res
        if(!ok) return this.$message({type: 'Error', message: 'something error'})
        this.CHANGE_REPORTS(data)
        this.isLoading = false
      })
    }
  },
  methods: {
    CHANGE_REPORTS(data){
      this.storeVue('_REPORTS').dispatch('CHANGE', data)
    },
    convertTimestampToDate(timestamp) {
      return CONST.convertDate(0, Number(timestamp))
    },
    onShowContent(report) {
      // const { id, post_id, post_title } = report
    },
    handleDelete(index, report) {
      let { reports, lang } = this
      let { id } = report
      this.$confirm(lang.warningDeleteReport, 'Warning', {
        confirmButtonText: lang.ok,
        cancelButtonText: lang.cancel,
        type: 'warning'
        })
        .then(() => {
          this.deleteAPI(REPORTS.DELETE, { id }, r => {
            if(!r.ok) return this.$message({type: 'Error', message: 'something error'})
            let index = reports.findIndex(i => i.id == id)
            reports.splice(index, 1)
            this.$message({ type: 'success', message: 'Xóa thành công' })
            this.CHANGE_REPORTS([...reports])
          })
        })
        .catch(() => '')
    }
  },
  mounted() {
  },
  computed:{
    reports(){
      return this.storeVue('_REPORTS').getters.reports
    },
    myAccount(){
      return this.storeVue('_ACCOUNT').getters.myAccount
    }
  }
};
</script>

<style lang="scss" scoped>
#reports-dashboard {
  .fix-line {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    margin: 0;
  }
}
</style>