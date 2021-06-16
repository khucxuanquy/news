<template>
  <div class="wrapper-login-dashboard" v-if="isExist">
    <div id="form-login">
      <div>
        <img src="https://news.laptrinhmaytinh.com/static/images/logo.png" style="margin-bottom: 2rem">
        <div>
          <el-form
            ref="formLogin"
            :model="formLogin"
            :rules="formRules"
            autoComplete="on"
          >
            <el-form-item prop="username">
              <!-- @keyup.enter.native="" -->
              <el-input
                ref="username"
                v-model.trim="formLogin.username"
                placeholder="Nhập tên tài khoản"
                type="text"
                autoComplete="on"
              ></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                ref="password"
                v-model="formLogin.password"
                placeholder="Nhập mật khẩu"
                type="password"
                show-password
                autoComplete="on"
              ></el-input>
            </el-form-item>
            <el-button @click.native.prevent="handleLogin" type="success" style="margin: auto; display: block; width: 100%">login</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ENUM from "const/api";
const { USERS } = ENUM

export default {
  data: function () {
    var dataComp = {}
    dataComp.formLogin = { username: "", password: "" };
    dataComp.formRules = {
      username: [{ required: true, trigger: "blur", message: "Tên tài khoản không hợp lệ" }],
      password: [{ required: true, trigger: "blur", message: "Vui lòng nhập Mật khẩu" }]
    };
    dataComp.isExist = false
    return dataComp;
  },
  created(){
    let info = localStorage.getItem('_info')
    if(info) return this.$router.push('/admin/dashboard')
    this.isExist = true
    localStorage.clear()
  },
  mounted() {
    if (this.$refs.username) this.$refs.username.focus();
  },
  methods: {
    handleLogin: function () {
      this.$refs.formLogin.validate((valid, failFields) => {
        if(!valid) {
          const FIELDS_INPUT = ["username", "password"];
          for (let i = 0; i < FIELDS_INPUT.length; i++) {
            if (failFields.hasOwnProperty(FIELDS_INPUT[i])) {
              this.$refs[FIELDS_INPUT[i]].focus();
              break;
            }
          }
          return;
        }
        const { username, password } = this.formLogin
        this.postAPI(USERS.LOGIN, { username, password, admin: true }, data => {
          const { ok, message, token } = data
          if(!ok) return this.$message({ message: message || 'Đăng nhập không thành công' , type: 'waring' })
          // if(_info.positon == 'reader') return;
          this.$message({ message, type: 'success' })
          localStorage.setItem( '_u', token)
          // location.pathname = '/admin/dashboard'
          location.pathname = 'admin/dashboard'
        });
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-login-dashboard {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: #76b852; /* fallback for old browsers */
  background: linear-gradient(to left, #76b852, #8DC26F);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;   
  #form-login {
    transform: translate(-50%, -50%);
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 400px;
    background: white;
    padding: 2.5rem;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    border-radius: .5rem;
    input {
      height: 50px!important
    }
  }
}
</style>
