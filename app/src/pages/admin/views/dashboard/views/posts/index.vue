<template>
  <div id="posts">
   <el-tabs v-model="labelName" type="card">
      <el-tab-pane :label="lang.postsManagement" name="manager"><ManagerPosts /></el-tab-pane>
      <el-tab-pane :label="lang.addNewPosts" name="addNew"><NewPost @handleSubmitFinish='handleSubmitFinish'/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ManagerPosts from './managerPosts'
import NewPost from './newPost'
export default {
  data() {
    return {
      labelName : 'manager'
    }
  },
  components: { NewPost, ManagerPosts },
  beforeCreate() {
    if(!localStorage.getItem('_u')) return this.$router.push('/admin/login');
  },
  methods: {
    handleSubmitFinish(val) {
      if(val) this.labelName = 'manager'
    }
  },
  computed: {
  }
};
</script>