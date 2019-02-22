<template>
  <section>
    <div class="navbar_box_r" v-if="!uid">
      <span class="username" @click="onChangeStatus">您好，请登录</span>
    </div>
    <div class="navbar_box_r" v-else>
      <span class="username"><nuxt-link to="/usercenter">{{ name }}</nuxt-link></span>
      <span class="logout" @click="onLogout">退出</span>
    </div>
    <!--<div class="qrcode" v-if="status === 1">-->
    <div class="qrcode" v-if="status === 2">
      <div class="qrcode_login">
        <p class="login_title">登录</p>
        <p class="login_phone" v-if="changeStatus === 1" @click="onLoginStatus">
          <img :src="phone_icon" alt="" class="phone_icon">
          <span class="phone_title">手机号登录</span>
        </p>
        <p class="login_phone"  v-if="changeStatus === 2" @click="onLoginStatus">
          <img :src="qr_icon" alt="" class="qr_icon">
          <span class="phone_title">扫码登录</span>
        </p>
      </div>
      <div class="qrcode_form" v-if="changeStatus === 1">
        <img :src="imgUrl" alt="" class="qrcode_img">
        <p class="qrcode_tip">打开手机端”扫一扫”即可登录</p>
      </div>
      <div class="qrcode_form" v-if="changeStatus === 2">
        <p class="qrcode_item">
          <span class="qrcode_title">手机号：</span>
          <input v-model.trim="phone" type="text" class="qrcode_input" placeholder="请输入手机号">
        </p>
        <p class="qrcode_item item_pwd">
          <span class="qrcode_title">密码：</span>
          <input v-model.trim="password" type="password" class="qrcode_input" placeholder="请输入密码">
        </p>
        <p class="qrcode_errortip">{{errorMsg}}</p>
        <p class="qrcode_loginbtn" @click="onLogin">登录</p>
        <p class="qrcode_register">
          <nuxt-link :to="`/`" class="qrcode_forgetpwd"></nuxt-link>
          <nuxt-link :to="`/register`" class="qrcode_forgetpwd">注册</nuxt-link>
        </p>
      </div>
    </div>
  </section>
</template>
<script>
// 插件
import axios from '~/plugins/axios'
import QRCode from 'qrcode'
// 组件
import qr_icon from '~/static/img/home/qr_icon.png'
import phone_icon from '~/static/img/home/phone_icon.png'
import {
  EMPLOYEE_READ,
  ENTERPRISE_MANAGER,
  CHECK_TOTAL_READ,
  NOTIFICATION,
  AUTHORITY
} from '~/utils/authority'

// 文件
let timeout = ''
export default {
  props: ['userInfo'],
  components: {},
  data () {
    return {
      qr_icon,
      changeStatus: 1,
      status: 1,
      phone_icon,
      hoverindex: -1,
      spunchStatus: 2,
      activeIndex: '1',
      phone: '',
      password: '',
      errorMsg: '',
      uid: null,
      imgUrl: '',
      name: '',
      identity: ''
    }
  },
  mounted () {
    const { userInfo } = this
    this.getEcode()
    let uid = userInfo ? userInfo.uid : null
    let name = userInfo ? userInfo.name : null
    this.uid = uid
    this.name = name
  },
  destroyed () {
    clearInterval(timeout)
  },
  methods: {
    // 登录
    async onLogin () {
      const { phone, password } = this
      const reg = /^1[3|4|5|6|7|8][0-9]\d{4,8}$/
      if (phone === '' || phone.length < 11 || !reg.test(phone)) {
        this.errorMsg = '手机号或密码有误'
        return false
      } else if (password === '') {
        this.errorMsg = '手机号或密码有误'
        return false
      } else {
        this.errorMsg = ''
        let loginInfo
        loginInfo = await axios.get('/pcapi/user/login', {
          params: {
            phone,
            password
          }
        })
        const { data } = loginInfo
        if (data.code === 0) {
          this.$store.dispatch('setUser', data.data)
          this.$router.push('/usercenter')
        } else if (data.code === -1) {
          this.errorMsg = '手机号或密码有误'
        } else {
          this.errorMsg = '网络有波动，请重试'
        }
      }
    },
    // 切换登录方式
    async onLoginStatus () {
      const { changeStatus } = this
      if (changeStatus === 2) {
        this.changeStatus = 1
      } else {
        this.changeStatus = 2
      }
    },
    // 请登录
    async onChangeStatus () {
      const { status, identity } = this
      if (status === 1) {
        this.status = 2
        let loginInfo
        let loginInitial
        let expiryTime = 1
        loginInitial = await axios.get('/pcapi/user/qr_login_initial', {
          params: {
            identity
          }
        })
        timeout = setInterval(async () => {
          loginInfo = await axios.get('/pcapi/user/qr_login_web', {
            params: {
              identity
            }
          })
          const { data } = loginInfo
          if (data.code === 0) {
            this.$store.dispatch('setUser', data.data)
            this.$router.push('/usercenter')
          }
          expiryTime++
          if (expiryTime > 120) {
            this.getEcode()
            expiryTime = 1
          }
        }, 1000)
      } else {
        this.status = 1
        clearTimeout(timeout)
      }
    },
    // 调用登录二维码
    getEcode () {
      // dakaApp-chat: 时间戳10位-ip-随机数
      const date = Date.parse(new Date())
        .toString()
        .substr(0, 10)
      const math = Math.random().toFixed(2) * 100
      const ip = returnCitySN['cip']
      const identity = `dakaApp-chat:${date}-${ip}-${math}`
      this.identity = identity
      // 自动生成二维码
      let opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        color: {
          dark: '#333'
        }
      }
      QRCode.toDataURL(identity, opts)
        .then(url => {
          this.imgUrl = url
        })
        .catch(err => {
          console.erros(err)
        })
    },
    // 退出登录
    async onLogout () {
      let logoutInfo = await axios.get('/pcapi/logout')
      const { data } = logoutInfo
      if (data === 200) {
        this.uid = null
        this.$store.dispatch('logout')
        this.$router.push('/')
      }
    }
  }
}
</script>
<style lang="scss">
.navbar_box_r {
  display: flex;
  align-items: center;
  font-size: 14px;
  .logout {
    margin-left: 14px;
    cursor: pointer;
  }
  .username {
    cursor: pointer;
    a {
      color: white;
    }
  }
}
.qrcode {
  width: 307px;
  height: 335px;
  background-color: white;
  box-shadow: 0px 2px 10px 0px rgba(0, 24, 148, 0.3);
  border-radius: 10px;
  overflow: hidden;
  position: absolute;
  right: 0px;
  top: 56px;
  .qrcode_login {
    display: flex;
    padding: 28px 30px 12px 30px;
    padding-bottom: 0px;
    justify-content: space-between;
    align-items: center;
    .login_title {
      color: #333333;
      font-size: 25.6px;
      line-height: 25.6px;
    }
    .login_phone {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      .phone_icon {
        width: 16px;
        height: 24px;
      }
      .phone_title {
        color: #333333;
        font-size: 16px;
        margin-left: 7px;
      }
    }
  }
  .qrcode_form {
    position: relative;
    .qrcode_img {
      width: 208px;
      height: 208px;
      display: block;
      margin: 0 auto;
      margin-top: 16px;
    }
    .qrcode_tip {
      color: #333333;
      font-size: 13px;
      line-height: 13px;
      text-align: center;
      margin-top: 22px;
    }
    .qrcode_item {
      display: flex;
      font-size: 14px;
      line-height: 14px;
      color: #333333;
      margin: 46px 24px 0 24px;
      display: flex;
      align-items: center;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        left: 61px;
        bottom: 0px;
        height: 6px;
        width: 1px;
        background-color: #026bff;
      }
      &::after {
        content: "";
        position: absolute;
        right: 12px;
        bottom: 0px;
        height: 6px;
        width: 1px;
        background-color: #026bff;
      }
      .qrcode_title {
        width: 56px;
        text-align: right;
        display: inline-block;
      }
      .qrcode_input {
        position: relative;
        text-indent: 4px;
        margin-left: 6px;
        padding: 2px 0;
        width: 184px;
        border-bottom: 1px solid #026bff;
      }
    }
    .item_pwd {
      margin-top: 42px;
    }
    .qrcode_errortip {
      color: #ff6565;
      font-size: 14px;
      line-height: 14px;
      position: absolute;
      top: 106px;
      height: 14px;
      text-align: center;
      width: 100%;
    }
    .qrcode_loginbtn {
      width: 240px;
      height: 38px;
      background-color: #026bff;
      border-radius: 19px;
      color: white;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      margin-top: 58px;
      cursor: pointer;
    }
    .qrcode_register {
      display: flex;
      justify-content: space-between;
      padding: 13px 36px;
    }
  }
}
</style>