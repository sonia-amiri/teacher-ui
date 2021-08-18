<template>
  <div class="login_container">

    <div class="register_box" v-bind:class="{hidden: registerHidden}">
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="80px"
               class="register_form">
        <el-form-item label="نام کاربری" prop="username">
          <el-input v-model="registerForm.username" placeholder="لطفا نام کاربری را وارد کنید"
                    prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item label="رمز عبور" prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="لطفا رمز عبور را وارد کنید"
                    prefix-icon="el-icon-lock"></el-input>
        </el-form-item>

        <el-form-item label="نوع" prop="roleId">
          <el-select v-model="registerForm.roleId" placeholder="لطفا نوع حساب کاربری را انتخاب کنید">
            <el-option label="دانشجو" value="1"></el-option>
            <el-option label="معلم " value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" round @click="register">ورود به سیستم  </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { errorTip } from '@/utils/tips'
export default {
  data () {
    const pwdCheck = async (rule, value, callback) => {
      if (this.registerForm.password !== this.checkPassword) return callback(new Error('两次'))
      callback()
    }
    return {
      checkPassword: '',
      loginHidden: false,
      registerHidden: false,
      regEmail: /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/,
      regName: /^[a-zA-Z][\dA-Za-z_]{2,32}$/,
      regMobile: /^0?1[3|4|5|8][0-9]\d{8}$/,
      userFlag: '',
      loginForm: {
        email: '',
        mobile: '',
        password: '',
        username: ''
      },
      registerForm: {
        email: '',
        mobile: '',
        nickname: '',
        password: '',
        roleId: '',
        secret: '',
        username: ''
      },
      loginFormRules: {
        userFlag: [
          { required: true, message: 'لطفا فیلد ها را وارد کنید', trigger: 'blur' }],
        password: [
          { required: true, message: 'لطفاً رمز ورود را وارد کنید', trigger: 'blur' },
          { min: 0, max: 16, message: 'طول 8 ~ 16 کاراکتر', trigger: 'blur' }
        ]
      },
      registerFormRules: {
        username: [
          { required: true, message: 'لطفا نام کاربری را وارد کنید', trigger: 'blur' },
          { min: 6, max: 32, message: 'طول 6 ~ 32 بیت است و باید با یک حرف شروع شود', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'لطفاً رمز ورود را وارد کنید', trigger: 'blur' },
          { min: 6, max: 32, message: 'طول 6 ~ 32 نویسه', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: pwdCheck, message: 'لطفاً همان رمز را وارد کنید', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: 'لطفا نام کاربری را وارد کنید', trigger: 'blur' },
          { min: 2, max: 32, message: 'طول 2 ~ 32 نویسه', trigger: 'blur' }
        ],
        email: [
          { pattern: /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+.[a-z]+$/, message: 'لطفاً آدرس ایمیل صحیح را وارد کنید', trigger: 'blur' },
          { required: true, message: 'لطفا ایمیل خود را وارد کنید', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: 'لطفاً شماره تلفن را وارد کنید', trigger: 'blur' },
          { min: 11, max: 32, message: 'طول 11 ~ 32 رقم است', trigger: 'blur' },
          { pattern: /^\d{11,}$/, message: 'طول 11 ~ 32 رقم است', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: 'لطفا نقشی را انتخاب کنید', trigger: 'blur' }
        ],
        secret: [
          { required: true, message: 'لطفاً کد دعوت را وارد کنید', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    resetRegisterForm () {
      this.$refs.registerFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (this.regMobile.test(this.userFlag)) this.loginForm.mobile = this.userFlag
        if (this.regEmail.test(this.userFlag)) this.loginForm.email = this.userFlag
        if (this.regName.test(this.userFlag)) this.loginForm.username = this.userFlag
        if (!(this.loginForm.email || this.loginForm.email || this.loginForm.username)) return false
        this.$axios.post(process.env.VUE_APP_BACKEND_URL + '/auth/login', this.loginForm)
          .then(value => {
            this.$message.success('ورود موفق')
            this.$router.push('/home')
          })
          .catch(errorTip)
      })
    },
    register () {
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return
        this.$axios.post(process.env.VUE_APP_BACKEND_URL + '/auth/login', this.registerForm)
          .then(value => {
            if(value.redirect == 'Teacher') {
              this.$message.success('ورود موفق')
              this.$router.push('/home')
            }
            if(value.redirect == 'RegisterTeacher') {
              this.$router.push('/RegisterTeacher')
            }
          })
      })
    },
    goLogin () {
      this.loginHidden = false
      this.registerHidden = true
    },
    goRegister () {
      this.loginHidden = true
      this.registerHidden = false
    }
  }
}
</script>

<style lang="less" scoped>
.hidden {
  display: none;
}

.login_container {
  direction: rtl;
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.register_box {
  width: 450px;
  height: 600px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.bottom-link {
  display: inline-block;
  padding-right: 30px;
}

.login_form, .register_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
