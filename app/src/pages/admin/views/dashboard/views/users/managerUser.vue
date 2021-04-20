<template>
  <div id="manager-users" v-loading.fullscreen.lock="isLoading">
    <el-table :data="filterListUsers" style="width: 100%">
      <el-table-column :label="lang.username" width="180">
        <template slot-scope="{row}">{{ row.username }}</template>
      </el-table-column>

      <el-table-column :label="lang.fullName" width="150">
          <template slot-scope="{row}">{{ row.fullName }}</template>
      </el-table-column>

      <el-table-column :label="lang.position" width="150">
        <template slot-scope="{row}">{{ permission(row.permission) }}</template>
      </el-table-column>
      <el-table-column width="160" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{lang.edit}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{lang.delete}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="users.length" @current-change="handleCurrentChange" :page-size="pageSize" style="text-align: center; margin-top: 1rem"></el-pagination>
  </div>
</template>

<script>
import CONST from 'const/const'
export default {
  data() {
    return {
      pageSize: 6,
      currentPage: 1,
      search: '',
      isLoading: false,
      showPopupEdit: false,
      idEditPost: ''
    }
  },
  components: {  },
  created(){
   
  },
  methods: {
    handleEdit(index, row){
      this.$emit("editRow", row)
    },
    handleDelete(index, row){
      this.$emit("deleteRow", row)
    },
    handleCurrentChange(numPage) {
      this.currentPage = numPage
    },
    convertTimestampToDate(timestamp) {
      return CONST.convertDate(0, Number(timestamp))
    },
    permission(number) {
      if(!number) return '- Error -'
      if(number == 3) return 'Admin'
      else if (number == 2) return this.lang.manage
      else return this.lang.staff
    }
  },
  mounted() {
  },
  computed:{
    users() {
      return this.storeVue("_USERS").getters.users
    },
    filterListUsers(){
      const { currentPage, pageSize } = this
      return this.users.filter((i, index) => index >= pageSize * (currentPage - 1) && index < currentPage * pageSize)
    }
  }
};
</script>

<style lang="scss">
#manager-users {
  width: 100%;
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
}
</style>