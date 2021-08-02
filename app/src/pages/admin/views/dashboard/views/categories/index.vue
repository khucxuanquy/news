<template>
  <div id="categories-dashboard" v-if="visiable">
    <el-card class="box-card" style="width: 100%" :style="{ 'maxWidth' : openForm ? '400px' : '300px' }">
      <el-button v-if="!openForm" type="primary" @click="openForm = true" plain>{{lang.addNewCategories}}</el-button>
      <div v-else>
        <div style="display: flex">
          <el-input v-model="formCategory.name" maxlength="50" :placeholder="lang.typeNewCategory" style="margin-right: 1rem"></el-input>
          <el-button v-if="isEditRow" type="primary" @click="submitEdit">{{lang.edit}}</el-button>
          <el-button v-else type="primary" @click="submit">{{lang.addNew}}</el-button>
          <el-button type="danger" @click="clear">{{lang.cancel}}</el-button>
        </div>
        <div style="display: flex; align-items: center; margin: 1rem ">
          <span style="margin-right: 1rem">{{lang.chooseColor}}</span> 
          <el-color-picker v-model="formCategory.color"></el-color-picker>
        </div>
        <el-divider>{{lang.preview}}</el-divider>
          <span class="testing" :style="{'background' : formCategory.color || '#000000'}"> {{formCategory.name}}</span>
          <span class="testing" style="text-transform: uppercase" :style="{'background' : formCategory.color || '#000000'}"> {{formCategory.name}}</span>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="text-align: center">
        <span>{{lang.listCategories}}</span>
      </div>
      <ManagerCategories @editRow="editRow" @deleteRow="submitDelete"  />
    </el-card>
  </div>
</template>

<script>
import ENUM from 'const/api'
const { CATEGORIES } = ENUM

import ManagerCategories from './managerCategories'
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      formCategory: {
        name: '',
        color: '#000000'
      },
      openForm: false,
      isEditRow: false,
      visiable: false
    }
  },
  components: { ManagerCategories },
  beforeCreate() {
    if(!localStorage.getItem('_u')) return this.$router.push('/admin/login').catch(()=>{});
  },
  created() {
    if(this.myAccount.permission <= 2) return this.$router.push('/admin/dashboard').catch(() => {})
    else this.visiable = true;
  },
  methods: {
    ...mapActions({
      CHANGE_CATEGORIES : '_CATEGORIES/CHANGE'
    }),
    submit() {
      const {categories, formCategory} = this
      // check valid
      if(formCategory.name == '') return this.$message({ message: 'Vui lòng nhập chủ đề', type: 'warning' })
      if(categories.some(i=> i.name == formCategory.name)) return this.$message({ message: 'Chủ đề đã tồn tại', type: 'warning' })
      this.postAPI(CATEGORIES.CREATE, { ...formCategory }, r => {
        const {ok, data} = r
        if(!ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
        this.CHANGE_CATEGORIES([...categories, data])
        this.clear()
      })
    },
    submitEdit(){
      const {categories, formCategory, lang} = this
      // check valid
      if(formCategory.name == '') return this.$message({ message: 'Vui lòng nhập chủ đề', type: 'warning' })
      if(this.categories.filter(i => i.name == this.formCategory.name).length >= 2) return this.$message({ message: 'Chủ đề bị trùng lặp', type: 'warning' })
      this.putAPI(CATEGORIES.EDIT, { id: formCategory.id, name: formCategory.name, color: formCategory.color }, r => {
        const { ok } = r
        if(!ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
        let index = categories.findIndex(i => i.id == formCategory.id)
        categories[index] = formCategory
        this.CHANGE_CATEGORIES([...categories])
        this.$message({ message: lang.editSuccess, type: 'success' })
        this.clear()
      })  
    },
    submitDelete(data){
      const { categories, lang } = this
      const { id } = data

      this.$confirm(lang.warningDeleteCategory, 'Warning', {
          confirmButtonText: lang.ok,
          cancelButtonText: lang.cancel,
          type: 'warning'
        }).then(() => {
          this.deleteAPI(CATEGORIES.DELETE, { id}, r => {
            const { ok } = r
            if(!ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
            let index = categories.findIndex(i => i.id == id)
            categories.splice(index, 1)
            this.$message({ type: 'success', message: lang.deleteSuccess })
            this.CHANGE_CATEGORIES(categories)
            this.clear()
          })
          
        }).catch(() => '')
    },
    editRow(data) {
      const { id, name, color } = data
      this.formCategory = { id, name, color }
      this.openForm = true
      this.isEditRow = true
    },
    clear() {
      this.formCategory = { name: '', color: '#000000' }
      this.openForm = false
      this.isEditRow = false
    },
  },
  computed:{
    ...mapGetters({
      categories : '_CATEGORIES/categories',
      myAccount: '_ACCOUNT/myAccount'
    })
  }
};
</script>

<style lang="scss" scoped>

#categories-dashboard {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 1rem 0;
  .el-card {
    margin-bottom: 2rem;
  }
  .testing {
    display: inline-block;
    padding: 3px 5px;
    margin:.2rem .5rem;
    border-radius: 4px;
    color: white
  }
}
</style>