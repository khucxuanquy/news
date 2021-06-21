<template>
  <div class="changePassword__container container">
    <div class="logo">
      <img
        src="https://laptrinhmaytinh.com/assets/images/logo_lg.png"
        class="rounded"
        alt="logo"
        @click="$router.push('/')"
      />
    </div>
    <div class="changePassword__body">
      <h1>Đổi mật khẩu</h1>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1"
          ><i class="fas fa-lock"></i
        ></span>
        <input
          v-model="userPassword"
          type="password"
          class="form-control"
          placeholder="Mật khẩu"
          aria-label="Password"
          aria-describedby="basic-addon1"
        />
      </div>
      <p v-show="errors.isErrPass" class="errorMessage">
        Vui lòng nhập mật khẩu từ 8 - 30 kí tự, bao gồm chữ hoa, chữ thường, số
      </p>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1"
          ><i class="fas fa-lock"></i
        ></span>
        <input
          v-model="userRePassword"
          type="password"
          class="form-control"
          placeholder="Nhập lại mật khẩu"
          aria-label="Re-Password"
          aria-describedby="basic-addon1"
        />
      </div>
      <p v-if="this.userPassword !== this.userRePassword" class="errorMessage">
        Mật khẩu không trùng khớp
      </p>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button @click="changePassword" class="btn btn-primary" type="button">
          Đổi mật khẩu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ENUM from "const/api";
const { USERS } = ENUM;

export default {
  data() {
    return {
      userPassword: "",
      userRePassword: "",
      errors: {
        isErrPass: false,
        isErrRepass: false,
      },
      token: "",
    };
  },
  created() {
    this.token = this.$route.params.token;
    this.getAPI(USERS.VERIFY_FORGOT_PASSWORD, { token: this.token }, (res) => {
      let { ok, message } = res;
      if (!ok) {
        this.$message({ message, type: "warning" });
        this.$router.push("/home/login");
      }
    });
  },
  methods: {
    validate() {
      if (
        this.userPassword !== "" &&
        this.validatePassword(this.userPassword)
      ) {
        this.errors.isErrPass = false;
      } else {
        this.errors.isErrPass = true;
      }
      if (
        this.userPassword === this.userRePassword &&
        this.userRePassword !== ""
      ) {
        this.errors.isErrRepass = false;
      } else {
        this.errors.isErrRepass = true;
      }
      if (!this.errors.isErrPass && !this.errors.isErrRepass) {
        return true;
      } else {
        return false;
      }
    },
    validatePassword(password) {
      var regex = /^([a-zA-Z0-9]{8,20})+$/;
      if (regex.test(password)) {
        return true;
      }
      return false;
    },
    changePassword() {
      if (this.validate()) {
        let d = {
          password: this.userPassword,
          rePassword: this.userRePassword,
          token: this.token,
        };
        this.postAPI(USERS.CHANGE_PASSWORD, d, (res) => {
          const { message, ok } = res;
          if (!ok) return this.$message({ message, type: "warning" });
          this.$message({ message, type: "success" });
          setTimeout(() => {
            this.$router.push('/home/login')
          }, 1000);
        });
      } else {
        this.$message({ message: 'invalid validate form', type: "warning" });
      }
    },
  },
};
</script>

<style scoped>
.container > * {
  padding: 15px;
}
.logo > img {
  max-width: 5rem;
}
.changePassword__body {
  margin: 0 auto;
  max-width: 400px;
  border: thin solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  background-color: #fff;
}
.changePassword__body > * {
  text-align: left;
  padding: 10px;
}
.btn__sendEmail {
  position: relative;
  right: 10px;
  top: 0;
}
.errorMessage {
  color: red;
  margin: -15px 0 -5px 0;
  text-align: left;
  font-size: 14px;
}
</style>