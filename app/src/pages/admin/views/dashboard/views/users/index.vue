<template>
  <div id="users-dashboard" v-if="visiabled">
      <el-card class="box-card" style="width: 100%" :style="{ 'maxWidth' : openForm ? '400px' : '300px' }">
      <el-button v-if="!openForm" type="primary" @click="openForm = true" plain>{{lang.addNewUsers}}</el-button>
      <div v-else>
        <div>
          <el-input v-model="formUser.fullName" :placeholder="lang.fullName" maxlength="50"></el-input>
          <el-input v-model="formUser.username" :placeholder="lang.username" maxlength="40" :disabled="isEditRow"></el-input>
          <el-input v-model="formUser.password" :placeholder="lang.password" maxlength="40" show-password></el-input>
          <el-select v-model="formUser.permission" :placeholder="lang.position">
            <el-option v-for="i in permission" :key="i.n" :label="i.m" :value="i.n"></el-option>
          </el-select>
          <div style="margin-top: 1rem">
            <el-button v-if="isEditRow" type="primary" @click="submitEdit">{{lang.edit}}</el-button>
            <el-button v-else type="primary" @click="submit">{{lang.addNew}}</el-button>
            <el-button type="danger" @click="clear">{{lang.cancel}}</el-button>
          </div>
        </div>
      </div>
    </el-card>
     <el-card class="box-card">
      <div slot="header" class="clearfix" style="text-align: center">
        <span>{{lang.listUsers}}</span>
      </div>
      <ManagerUser @editRow="editRow" @deleteRow="submitDelete"  />
    </el-card>
  </div>
</template>

<script>
import ENUM from 'const/api'
const { USERS } = ENUM

import ManagerUser from './managerUser'
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      formUser: {
        fullName: '',
        username: '',
        password: '',
        permission: null,
      },
      openForm: false,
      isEditRow: false
    }
  },
  components: { ManagerUser },
  beforeCreate() {
    if(!localStorage.getItem('_u')) return this.$router.push('/admin/login').catch(()=>{});
  },
  created(){
    if(this.myAccount.permission >= 2) this.visiabled = true
  },
  methods: {
    ...mapActions({
      CHANGE_USERS: '_USERS/CHANGE'
    }),
    submit() {
      const {users, formUser} = this
      const { fullName, password, permission, username } = formUser
      if(!fullName || !password || !permission ||!username ) return this.$message({ message: 'Vui lòng nhập đầy đủ thông tin', type: 'warning' })
      if(users.some(i=> i.username == username)) return this.$message({ message: 'username đã tồn tại', type: 'warning' })
      this.postAPI(USERS.CREATE, { ...formUser }, r => {
        const {ok, data} = r
        if(!ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
        this.CHANGE_USERS([...users, data])
        this.clear()
      })
    },
    submitEdit(){
      let { users, formUser } = this
      const { id, fullName, password, permission, username } = formUser
      if(!fullName || !password || !permission ||!username ) return this.$message({ message: 'Vui lòng nhập đầy đủ thông tin', type: 'warning' })

      if(users.filter(i => i.username == username).length >= 2) return this.$message({ message: 'username đã tồn tại', type: 'warning' })
      this.putAPI(USERS.EDIT, formUser, r => {
        const { ok } = r
        if(!ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
        let index = users.findIndex(i => i.id == id)
        users[index] = formUser
        this.CHANGE_USERS([...users])
        this.$message({ message: 'Sửa thành công', type: 'success' })
        this.clear()
      })  
    },
    submitDelete(data){
      const { users } = this
      const { id } = data

      this.$confirm('Ban muon xoa nguoi dung nay', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.deleteAPI(USERS.DELETE, { id}, r => {
            const { ok } = r
            if(!ok) return this.$message({ message: 'Có lỗi sảy ra', type: 'Error' })
            let index = users.findIndex(i => i.id == id)
            users.splice(index, 1)
            this.$message({ type: 'success', message: 'Xóa thành công' })
            this.CHANGE_USERS([...users])
            this.clear()
          })
          
        }).catch(() => '')
    },
    editRow(data) {
      const { id, fullName, password, permission, username } = data
      this.formUser = { id, fullName, password, permission, username }
      this.openForm = true
      this.isEditRow = true
    },
    clear() {
      this.formUser = {
        fullName: '',
        username: '',
        password: '',
        permission: null,
      }
      this.openForm = false
      this.isEditRow = false
    }
  },
  mounted() {
  },
  computed: {
    ...mapGetters({
      myAccount: '_ACCOUNT/myAccount',
      users: '_USERS/users',
    }),
    permission() {
      const permission = this.myAccount.permission
      let arr = [{ n:3, m: 'Admin'}, {n:2, m: this.lang.manage}, {n:1, m: this.lang.staff }] 
      if(permission == 3) return arr
      if (permission == 2) return [arr[2]]
      else return []
    }
  }
};
</script>

<style lang="scss" scoped>

#users-dashboard {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 1rem 0;
  
  .el-card {
    margin-bottom: 2rem;
  }
  .el-input {
    margin-bottom: .3rem;
    width: 80%;
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