<template>
  <div class="wrapper-login">
    <div id="form-register" v-if="isExist">
      <div>
        <img
          src="https://news.laptrinhmaytinh.com/static/images/logo.png"
          style="margin-bottom: 2rem"
        />
        <div>
          <el-form
            ref="formRegister"
            :model="formRegister"
            :rules="formRules"
            autoComplete="on"
          >
            <el-form-item prop="username">
              <el-input
                ref="username"
                v-model.trim="formRegister.username"
                placeholder="Nhập tên tài khoản"
                type="text"
                autoComplete="on"
              ></el-input>
            </el-form-item>

             <el-form-item prop="fullname">
              <el-input
                ref="fullname"
                v-model.trim="formRegister.fullname"
                placeholder="Nhập họ và tên"
                type="text"
                autoComplete="on"
              ></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                ref="password"
                v-model.trim="formRegister.password"
                placeholder="Nhập mật khẩu"
                type="password"
                show-password
                autoComplete="on"
              ></el-input>
            </el-form-item>

            <el-form-item prop="rePassword">
              <el-input
                ref="rePassword"
                v-model.trim="formRegister.rePassword"
                placeholder="Nhập lại mật khẩu"
                type="password"
                show-password
                autoComplete="on"
              ></el-input>
            </el-form-item>

            <el-button
              @click.native.prevent="submit()"
              type="success"
              style="margin: auto; display: block; width: 100%"
              >Đăng kí</el-button>

              <div style="margin-top: .7em">
                <span>Bạn đã có tài khoản? </span><router-link to="/login"> Đăng nhập </router-link>
              </div>
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
    return {
      formRegister : { username: "", fullname: "", password: "", rePassword: "" },
      formRules: {
        username: [{ required: true, trigger: "blur", message: "Vui lòng nhập tên tài khoản"}],
        fullname: [{ required: true, trigger: "blur", message: "Vui lòng nhập họ tên"}],
        password: [{ required: true, trigger: "blur", message: "Vui lòng nhập Mật khẩu" }],
        rePassword: [{ required: true, trigger: "blur", message: "Vui lòng nhập Mật khẩu" }],
      },
      isExist: false
    }
  },
  created() {
    if(localStorage.getItem("_u")) return this.$router.push('/')
    this.isExist = true;
  },
  mounted() {
    if (this.$refs.username) this.$refs.username.focus();
  },
  methods: {
    submit: function () {
      this.$refs.formRegister.validate((valid, failFields) => {
        if(!valid) {
          const FIELDS_INPUT = ["username", "password", "rePassword"];
          for (let i = 0; i < FIELDS_INPUT.length; i++) {
            if (failFields.hasOwnProperty(FIELDS_INPUT[i])) {
              this.$refs[FIELDS_INPUT[i]].focus();
              break;
            }
          }
          return;
        }
        const { username, password, fullname, rePassword } = this.formRegister
        if(password !== rePassword) return this.$message({ type: 'waring' , message: 'Mật khẩu phải giống nhau'})

        // this.postAPI(USERS.LOGIN, { username, password }, data => {
        //   const { ok, message, token } = data
        //   if(!ok) return this.$message({ message: message || 'Đăng nhập không thành công' , type: 'waring' })
        //     localStorage.setItem( '_u', token)
        //     this.verify(token, (err, account) => {
        //       if (err) return console.error(err)
        //       console.log(token, account)
        //       this.storeVue('_USERS').dispatch('CHANGE_MY_ACCOUNT', account)
        //       this.$message({ message, type: 'success' })
        //       this.$router.push('/admin/dashboard')
        //     })
        // });
      })
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

  #form-register {
    transform: translate(-50%, -40%);
    position: absolute;
    top: 40%;
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
    .el-form-item {
      margin-bottom: 18px
    }
  }
}
</style>
