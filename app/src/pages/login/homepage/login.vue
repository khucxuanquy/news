<template>
  <div class="login container" >
    <div class="logo">
      <img
        src="https://laptrinhmaytinh.com/assets/images/logo_lg.png"
        class="rounded"
        alt="logo"
        @click="$router.push('/')"
      />
    </div>
    <h3>Đăng nhập</h3>
    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1"
        ><i class="far fa-envelope"></i
      ></span>
      <input
        v-model="userGmail"
        type="email"
        class="form-control"
        placeholder="Email"
        aria-label="Email"
        aria-describedby="basic-addon1"
      />
    </div>
    <p class="errorMessage" v-show="isErrorGmail">Vui lòng nhập gmail</p>
    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1"
        ><i class="fas fa-lock"></i
      ></span>
      <input
        v-model="userPassword"
        type="password"
        class="form-control"
        placeholder="Password"
        aria-label="Password"
        aria-describedby="basic-addon1"
      />
    </div>
    <p class="errorMessage" v-show="isErrorPassword">Vui lòng nhập mật khẩu</p>
    <div>
      <button @click="loginToPage" class="btn w-100 btn-primary btn__login">
        Đăng nhập
      </button>
    </div>
    <div class="d-flex justify-content-between my-2">
      <router-link to="/home/forgotPassword">Quên mật khẩu</router-link>
      <router-link to="/home/register">Đăng kí</router-link>
    </div>
  </div>
</template>

<script>
import ENUM from "const/api";

export default {
  data() {
    return {
      userGmail: "",
      userPassword: "",

      isErrorGmail: true,
      isErrorPassword: false,
    };
  },
  methods: {
    validate() {
      //   this.isErrorGmail = !!this.userGmail;
      if (this.userGmail === "") {
        this.isErrorGmail = true;
      } else {
        this.isErrorGmail = false;
      }

      if (this.userPassword === "") {
        this.isErrorPassword = true;
      } else {
        this.isErrorPassword = false;
      }
      if (!this.isErrorGmail && !this.isErrorPassword) {
        return true;
      } else {
        return false;
      }
    },
    loginToPage() {
      if (this.validate()) {
        let d = {
          username: this.userGmail, // "conankun7012@gmail.com",
          password: this.userPassword, // "conanA@",
        };
        this.postAPI(ENUM.USERS.LOGIN, d, response => {
          let { ok, message, token } = response
          if(!ok)return this.$message({ message: 'Đăng nhập không thành công', type: 'warning' })
          this.$message({ message, type: 'success' })
          localStorage.setItem("_u", token);
          location.pathname = ''
        });
      } else {
        this.$message({ message: 'invalid validate form', type: "warning" });
      }
    },
  },
};
</script>

 <style scoped>
.login {
  max-width: 400px;
  border-radius: 2%;
  border: thin solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background-color: #fff;

  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.login > * {
  padding: 5px;
}
.logo > img {
  max-width: 3rem;
  margin: 2rem 0 1rem 0;
}
.errorMessage {
  color: red;
  margin: -15px 0 -5px 0;
  text-align: left;
  font-size: 14px;
}
.alert {
  display: flex;
  align-items: center;
  line-height: 100%;
}
.alert > * {
  padding-left: 10px;
}
.alert__message {
  padding-top: 15px;
}
</style>