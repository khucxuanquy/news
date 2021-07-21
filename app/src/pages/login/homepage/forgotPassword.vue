<template>
  <div class="forgotPassword__container container">
    <div class="logo">
      <img
        src="https://doan.khucblog.com/static/images/logo_lg.png"
        class="rounded"
        title="homepage"
        style="cursor: pointer"
        alt="logo"
        @click="$router.push('/')"
      />
    </div>
    <div class="forgotPassword__body">
      <h1>Quên mật khẩu</h1>
      <p>
        Bạn quên mật khẩu của mình? Đừng lo lắng! Cung cấp cho chúng tôi email
        được sử dụng để đăng ký tài khoản của bạn. Chúng tôi sẽ gửi cho bạn một
        liên kết để đặt lại mật khẩu của bạn qua thư.
      </p>
      <div class="input-group mb-3">
        <input
          v-model="email"
          type="email"
          class="form-control"
          placeholder="Email"
          aria-label="Password"
          aria-describedby="basic-addon1"
        />
      </div>
      <p class="errorMessage" v-show="errorEmail">Vui lòng nhập đúng email</p>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button @click="sendToEmail" class="btn btn-primary" type="button">
          Gửi yêu cầu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ENUM from 'const/api'
const { USERS } = ENUM
export default {
  data() {
    return {
      email: "",
      errorEmail: false,
      checkSendEmail: false
    };
  },
  methods: {
    validateValue() {
      if (this.email) {
        this.errorEmail = false;
        return true;
      } else {
        this.errorEmail = true;
        return false;
      }
    },
    sendToEmail() {
      if(this.checkSendEmail) return this.$message({ message: 'Chúng tôi đã gửi email cho bạn. Vui lòng vào email để xem và làm các bước để lấy lại mật khẩu.', type: 'success' });
      if (this.validateValue()) {
        this.postAPI(USERS.FORGOT_PASSWORD, { email: this.email }, res => {
          let { ok, message } = res
          if(!ok) return this.$message({ message, type: 'warnig' })
          this.checkSendEmail = true
          this.$message({ message, type: 'success' })
        })

      } else {
        this.$message({ message: 'invalid validate form', type: "warning" });
      }
    },
  },
};
</script>

<style lang="scss"  scoped>
.forgotPassword__container {
  &.container > * {
    padding: 15px;
  }
  .logo > img {
    max-width: 5rem;
  }
  .forgotPassword__body {
    margin: 0 auto;
    max-width: 60%;
    min-width: 400px;
    border: thin solid #ebeef5;
    box-shadow: 0 2px 12px 0 #0000001a;
    background-color: #fff;
  }
  .forgotPassword__body > * {
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
    margin: -20px 0 -5px 0;
    text-align: left;
    font-size: 14px;
  }
}
</style>