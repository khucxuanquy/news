<template>
    <div class="register container">
        <div class="logo">
            <img src="https://laptrinhmaytinh.com/assets/images/logo_lg.png" class="rounded" alt="logo">
        </div>
        <h3>Đăng ký</h3>
         <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1"><i class="far fa-user"></i></span>
            <input v-model="userName" required  type="text" class="form-control" placeholder="Tên tài khoản" aria-label="User name" aria-describedby="basic-addon1">
        </div>
        <p class="errorMessage" v-show="error.isErrName">Vui lòng nhập tên tài khoản</p>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1"><i class="far fa-envelope"></i></span>
            <input v-model="userGmail"  type="email" class="form-control" placeholder="Gmail" aria-label="Email" aria-describedby="basic-addon1">
        </div>
        <p v-show="error.isErrGmail" class="errorMessage">Vui lòng nhập đúng định dạng gmail</p>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1"><i class="fas fa-lock"></i></span>
            <input v-model="userPassword"  type="password" class="form-control" placeholder="Mật khẩu" aria-label="Password" aria-describedby="basic-addon1">
        </div>
        <p v-show="error.isErrPass" class="errorMessage">Vui lòng nhập mật khẩu từ 8 - 30 kí tự, bao gồm chữ hoa, chữ thường, số</p>
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1"><i class="fas fa-lock"></i></span>
            <input v-model="userRePassword"  type="password" class="form-control" placeholder="Nhập lại mật khẩu" aria-label="Re-Password" aria-describedby="basic-addon1">
        </div>
        <p v-if="this.userPassword !== this.userRePassword" class="errorMessage">Mật khẩu không trùng khớp</p>
        <div>
            <button type="submit" class="btn w-100 btn-primary btn__login" @click="RegisterToPage">Đăng ký</button>
        </div>
        <div class="d-flex justify-content-center">
            <a href="#">Đã có tài khoản</a>
        </div>
        
    </div>
</template>

<script>
// import axios from 'axios'
export default {
    data(){
        return {
            userName:'',
            userGmail:'',
            userPassword:'',
            userRePassword:'',
            error:{
                isErrName:false,
                isErrGmail:false,
                isErrPass:false,
                isErrRepass:false,
            }
        }
    },
    methods:{
        validate(){
            if(this.userName === '' ){
                this.error.isErrName = true;
               
            }
            else{
                this.error.isErrName = false
                
            }
            if(this.userGmail !=='' && this.validatEemail(this.userGmail)){
               this.error.isErrGmail = false
              
            }
             else{
                this.error.isErrGmail = true
                
            }
            if(this.userPassword !== '' && this.validatePassword(this.userPassword)){
                 this.error.isErrPass = false
               
            }
             else{
                 this.error.isErrPass = true
               

               
            }
            if(this.userPassword === this.userRePassword && this.userRePassword !== '' ){

               this.error.isErrRepass = false
                  
            }
             else{
                  this.error.isErrRepass = true
        
                 
            }
           if(!this.error.isErrName && !this.error.isErrGmail && !this.error.isErrPass && !this.error.isErrRepass){
               return true
           }
           else{
               return false
           }
        },
        validatEemail(email) {
        
			var regex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if(regex.test(email)) {
				return true;
			}
			return false;
            },
     validatePassword(password) {
        
          
			var regex = /^([a-zA-Z0-9]{8,20})+$/;
			if(regex.test(password)) {
				return true;
			}
			return false;
    } ,
        RegisterToPage(){
            if(this.validate()){
            console.log("success")
               this.postData()
               
            }
            else{
                console.log("false")
            }
        },
        postData(){
   
}
    }
}
</script>

<style scoped>
     .register{
      max-width: 400px;
      border-radius: 2% ;
      border: thin solid #ebeef5 ;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      background-color: #fff
   }
   .register>*{
       padding: 5px;
   }
    .logo>img{
        max-width: 3rem;
        margin: 2rem 0 1rem 0;
    }
    .errorMessage{
        color: red;
        margin: -15px 0 -5px 0;
        text-align: left;
        font-size: 14px;
    }
</style>