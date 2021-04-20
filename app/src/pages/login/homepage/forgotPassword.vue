<template>
  <div class="wrapper-login">
    <div id="form-login" v-if="isExist">
      <div>
        <h3 style="text-align: center; margin-bottom: 1em">Lấy lại mật khẩu</h3>
        <div>
          <el-form
            ref="formLogin"
            :model="formLogin"
            :rules="formRules"
            autoComplete="on"
          >
            <el-form-item prop="email">
              <el-input
                ref="email"
                v-model.trim="formLogin.email"
                placeholder="Nhập email của bạn"
                type="text"
                autoComplete="on"
              ></el-input>
            </el-form-item>

            <el-button
              @click.native.prevent="handleLogin"
              type="success"
              style="margin: auto; display: block; width: 100%"
              >Gửi</el-button
            >
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ENUM from "const/api";

export default {
  data: function () {
    var dataComp = {};
    dataComp.formLogin = { username: "", password: "" };
    dataComp.formRules = {
      username: [
        {
          required: true,
          trigger: "blur",
          message: "Tên tài khoản không hợp lệ",
        },
      ],
      password: [
        { required: true, trigger: "blur", message: "Vui lòng nhập Mật khẩu" },
      ],
    };
    dataComp.isExist = false;
    return dataComp;
  },
  created() {
    let token = localStorage.getItem("_u");
    // if(!token) return this.isExist = true // cho show form login
    // this.verify(token, (err, account) => {
    //   if(!err) return this.$router.push('/admin/dashboard')
    this.isExist = true;
    //   localStorage.removeItem('_u')
    // })
  },
  mounted() {
    if (this.$refs.username) this.$refs.username.focus();
  },
  methods: {
    handleLogin: function () {
      // this.$refs.formLogin.validate((valid, failFields) => {
      //   if(!valid) {
      //     const FIELDS_INPUT = ["username", "password"];
      //     for (let i = 0; i < FIELDS_INPUT.length; i++) {
      //       if (failFields.hasOwnProperty(FIELDS_INPUT[i])) {
      //         this.$refs[FIELDS_INPUT[i]].focus();
      //         break;
      //       }
      //     }
      //     return;
      //   }
      //   const { username, password } = this.formLogin
      //   this.postAPI(USERS.LOGIN, { username, password }, data => {
      //     const { ok, message, token } = data
      //     if(!ok) return this.$message({ message: message || 'Đăng nhập không thành công' , type: 'waring' })
      //       localStorage.setItem( '_u', token)
      //       this.verify(token, (err, account) => {
      //         if (err) return console.error(err)
      //         console.log(token, account)
      //         this.storeVue('_USERS').dispatch('CHANGE_MY_ACCOUNT', account)
      //         this.$message({ message, type: 'success' })
      //         this.$router.push('/admin/dashboard')
      //       })
      //   });
      // })
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-login {
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
    border-radius: 0.5rem;

    input {
      height: 50px !important;
    }
  }
}
</style>
