<template>
  <div id="form-post">
    <el-dialog :title="lang.edit + ' ' + lang.post" v-loading="!isFinishLoad" :visible.sync="visiable" :before-close="closeDialog" width="80vw">
      <el-form :label-position="'left'" label-width="100px" :model="form">
      <el-form-item :label="lang.title">
        <el-input v-model="form.title" :placeholder="lang.typeTitle" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item :label="lang.category">
        <el-select v-model="form.category_id" filterable default-first-option :placeholder="lang.selectCategory">
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
          class="avatar">
          <div slot="placeholder" class="image-slot"> Loading<span class="dot">...</span></div>
          <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
        </el-image>
        <el-button v-if="isShowImage" type="primary" size="small" @click="isShowImage = false, form.image = ''" style="margin: 0 auto">{{lang.clearImage}}</el-button>
      </el-form-item>
      <!-- import Tiny components -->
      <Tiny :id="'xuanquy79xx_edit'" @input="input" :value="form.content" :action="action" :height="500"></Tiny>
      <el-button type="primary" size="small" @click="submit()" class="btn-submit">{{ lang.edit + ' ' + lang.post }}</el-button>
    </el-form>
    </el-dialog>
    {{getDataPost}}
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
        category_id: '',
        content : '',
        image: '',
        description: ''
      },
      action: MEDIA,
      isShowImage: true,
      isFinishLoad: true
    }
  },
  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },
  components: { Tiny },
  created() { },
  methods: {
    submit() {
      let { id, title, category_id, content, image, description } = this.form
      let { posts } = this
      if(!title || !category_id || !content || !description || !image) return this.$message({
        showClose: true,
        message: 'Vui long Nhập đầy đủ thông tin',
        type: 'warning'
      });
      let d = {
        id,
        title,
        content,
        description,
        category_id,
        image
      }
      // check valid
      this.putAPI(POSTS.EDIT, d, r => {
        const { ok } = r
        if(!ok) return this.$message({ type: 'Error', message: 'Có lỗi sảy ra! Lỗi khi sửa bài viết' })
        
        this.$message({ type: 'success', message: 'Sửa bài viết thành công' })
        let index = posts.findIndex(i => i.id == id)
        posts[index] = {...posts[index], ...d}
        this.CHANGE_POSTS([...posts])
        this.clear()
        this.closeDialog()
      })
    },
    input(content){
      this.form.content = content
    },
    clear() {
      this.form.title = ''
      this.form.category_id = ''
      this.form.image = ''
      this.form.description = ''
      window.tinymce.get('xuanquy79xx_edit').setContent('')
    },
    onUploadSuccess(response, file, fileList) {
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
    closeDialog() {
      this.clear()
      this.$emit('handleClose', false)
    },
  },
  computed: {
    categories(){
      return this.storeVue('_CATEGORIES').getters.categories
    },
    posts(){
      return this.storeVue('_POSTS').getters.posts
    },
    getDataPost(){
      if(this.visiable) {
        this.isFinishLoad = false
        this.getAPI(POSTS.GET, { id: this.id }, r => {
          if(!r.data) {
            this.$message({ type: 'Error', message: 'Có lỗi sảy ra' })
            this.closeDialog()
            this.isFinishLoad = true
          }
          r.data.category = r.data.category_id
          r.data.id = this.id
          this.form = r.data
          window.tinymce.get('xuanquy79xx_edit').setContent(r.data.content)
          this.isFinishLoad = true
        })
      }
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