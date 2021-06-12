<template>
  <div id="form-post">
    <el-form :label-position="'left'" label-width="100px" :model="form">
      <el-form-item :label="lang.title">
        <el-input v-model="form.title" :placeholder="lang.typeTitle" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item :label="lang.category">
        <el-select v-model="form.category" filterable default-first-option :placeholder="lang.selectCategory">
          <el-option v-for="i in categories" :key="i.id" :label="i.name" :value="i.id">
            <span :style="{'color' : i.color, 'font-weight': 'bold' }"> {{i.name}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="lang.description">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="150" :placeholder="lang.typeDescription" v-model="form.description" show-word-limit>
      </el-input>
      </el-form-item>
      <el-form-item :label="lang.imagePost">
        <el-input v-model="form.image" :placeholder="lang.typeUrlImage"  @keydown.native="typeLinkImage"></el-input>
        <p v-if="!isShowImage">or</p>
        <el-upload 
          v-if="!this.isShowImage"
          class="avatar-uploader"
          :action="action"
          list-type="picture-card"
          :show-file-list="false"
          :on-success="onUploadSuccess"
          :before-upload="onBeforeUpload">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-image v-else 
          :src="form.image"
          :preview-src-list="[form.image]"
          class="avatar">
          <div slot="placeholder" class="image-slot"> Loading<span class="dot">...</span></div>
          <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
        </el-image>
        <el-button v-if="isShowImage" type="primary" size="small" @click="isShowImage = false, form.image = ''" style="margin: 0 auto">clear image</el-button>
      </el-form-item>
      <!-- import Tiny components -->
      <Tiny :id="'xuanquy79xx'" @input="input" :value="form.content" :action="action" :height="500"></Tiny>
      <el-button type="primary" size="small" @click="submit()" class="btn-submit">{{ lang.addNew }}</el-button>
    </el-form>
  </div>
</template>

<script>
import Tiny from 'components/Tinymce'
import ENUM from 'const/api'
const { MEDIA, POSTS } = ENUM

export default {
  data() {
    return {
      form: {
        title : '',
        category: '',
        content : '',
        image: '',
        description: ''
      },
      isShowImage: false,
      action: MEDIA,
      isEditPost: false
    }
  },
  components: { Tiny },
  beforeCreate(){
    // let c = localStorage.getItem('_') 
    // if(!(c && c == '__')) return this.$router.push('/')
  },
  created(){
   
  },
  methods: {
    submit() {
      let { title, category, content, image, description } = this.form
      if(!title || !category || !content || !description || !image) return this.$message({
          showClose: true,
          message: 'Vui long Nhập đầy đủ thông tin',
          type: 'warning'
        });
      let d = { 
        title,
        content,
        description,
        category,
        image: image || ''
      }
      // check valid
      this.postAPI(POSTS.CREATE, d, r => {
        const { ok, data } = r
        if(!ok) return this.$message({ type: 'Error', message: 'Có lỗi sảy ra' })
        
        this.$message({ type: 'success', message: 'Tạo bài viết thành công' })
        this.CHANGE_POSTS([data, ...this.posts])
        let total = this.totalPosts + 1
        this.CHANGE_TOTAL_POSTS(total)
        this.$emit('handleSubmitFinish', true)
        this.clear()
      })
    },
    input(content){
      this.form.content = content
    },
    clear() {
      this.form.title = ''
      this.form.category = ''
      this.form.image = ''
      this.form.description = ''
      // reset Tiny
      window.tinymce.get('xuanquy79xx').setContent('')
    },
    onUploadSuccess(response, file, fileList) {
      console.log(115, response)
      const { location } = response
      this.form.image = location
      this.isShowImage = true
    },
    onBeforeUpload(file) {
        if (!/^image\/(jpeg|jpg|png|gif)$/.test(file.type)) {
        this.$message({
          showClose: true,
          message: 'Chỉ chấp nhận file ảnh định dạng jpg/jpeg/png/gif ',
          type: 'warning',
          duration: 2000,
        });
        return false;
      }
      return true;
    },
    typeLinkImage(){
      setTimeout(() => this.isShowImage = !!this.form.image, 0)
    },
    CHANGE_POSTS(data){
      this.storeVue('_POSTS').dispatch('CHANGE', data)
    },
    CHANGE_TOTAL_POSTS(total) {
      this.storeVue('_POSTS').dispatch('CHANGE_TOTAL', total)
    },
  },
  mounted() {
  },
  computed:{
    categories(){
      return this.storeVue('_CATEGORIES').getters.categories
    },
    posts(){
      return this.storeVue('_POSTS').getters.posts
    },
    totalPosts() {
      return this.storeVue('_POSTS').getters.totalPosts
    }
  }
};
</script>

<style lang="scss">
#form-post {
  width: 100%;
  padding: 0 1rem;
  .el-form-item {
    max-width: 400px;
    margin-bottom: 1rem;
  }
  button.btn-submit {
    display: block;
    margin: 1rem auto;
  }
  .avatar {
    margin: .8rem 0 0 0;
    width: 100%;
  }
}
</style>