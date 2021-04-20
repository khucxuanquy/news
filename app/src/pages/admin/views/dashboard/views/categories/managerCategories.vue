<template>
  <div id="manager-categories">
    <el-table :data="filterlistCategories.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))">
      <el-table-column :label="lang.nameCategory" width="180">
        <template slot-scope="scope">
          <span class="testing" :style="{'background' : scope.row.color || '#000000'}">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="160">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" :placeholder="lang.search"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">{{lang.edit}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{lang.delete}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" :total="categories.length" @current-change="handleCurrentChange" :page-size="pageSize" style="text-align: center; margin-top: 1rem"></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 6,
      currentPage: 1,
      search: ''
    }
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
    CHANGE_CATEGORIES(data){
      this.storeVue('_CATEGORIES').dispatch('CHANGE', data)
    },
  },
  computed:{
    filterlistCategories() {
      const { currentPage, pageSize } = this
      return this.categories.filter((i, index) => index >= pageSize * (currentPage - 1) && index < currentPage * pageSize)
    },
    categories() {
      return this.storeVue('_CATEGORIES').getters.categories
    },
  }
};
</script>

<style lang="scss" scoped>
#manager-categories {
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
    height: 50px
  }
}

</style>