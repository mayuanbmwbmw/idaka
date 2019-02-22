<template>
    <section class="navbar" :style="{backgroundColor}">
        <div class="public_box">
            <div class="navbar_box">
                <div class="navbar_box_l">
                    <div class="navbar_name">
                        <nuxt-link class="navbar_name_link" :to="`/`">
                            <img :src="navbar_logo" alt="" class="navbar_icon">
                            <span class="navbar_title">打卡助手</span>
                        </nuxt-link>
                    </div>
                    <no-ssr>
                        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
                            <!--<el-menu :default-active="'3'" class="el-menu-demo" mode="horizontal">-->
                            <el-menu-item index="1">
                                <nuxt-link class="navbar_link" :to="`/`">首页</nuxt-link>
                            </el-menu-item>
                            <el-menu-item index="2">
                                <a target="_blank" href="https://daka.troila.com" class="navbar_link">聊天</a>
                            </el-menu-item>
                            <el-submenu index="3" v-if="uid && permissions > 0">
                                <template slot="title">
                                    <nuxt-link class="navbar_link" :to="`/workbunch`" :style="{color: 'white'}">工作台
                                    </nuxt-link>
                                </template>
                                <template v-for="(item, index) in bunchList">
                                    <template v-if="item.itemList">
                                        <el-submenu v-if="(item.permissions & permissions) === item.permissions"
                                                    :index="`${index}`" :key="index">
                                            <template slot="title">{{ item.title }}</template>
                                            <el-menu-item v-for="(item1, index1) in item.itemList"
                                                          :index="`${index}-${index1}`" :key="index1">
                                                <nuxt-link class="navbar_link" :to="item1.href">{{ item1.title }}
                                                </nuxt-link>
                                            </el-menu-item>
                                        </el-submenu>
                                    </template>
                                    <template v-else>
                                        <el-menu-item v-if="(item.permissions & permissions) === item.permissions"
                                                      index="5" :key="index">
                                            <nuxt-link class="navbar_link" :to="item.href">{{ item.title }}</nuxt-link>
                                        </el-menu-item>
                                    </template>
                                </template>
                            </el-submenu>
                            <el-menu-item index="5">
                                <nuxt-link class="navbar_link" to="/abouttrolia">关于我们</nuxt-link>
                            </el-menu-item>
                        </el-menu>
                    </no-ssr>
                </div>
                <div class="navbar_box_r" v-if="!uid">
                    <span class="username" @click="onChangeStatus">您好，请登录</span>
                </div>
                <div class="navbar_box_r" v-else>
                    <span class="username"><nuxt-link to="/usercenter">{{ name }}</nuxt-link></span>
                    <span class="logout" @click="onLogout">退出</span>
                </div>
            </div>

            <!--<div class="qrcode" v-if="status === 1">-->
            <div class="qrcode" v-if="status === 2">
                <div class="qrcode_login">
                    <p class="login_title">登录</p>
                    <p class="login_phone" v-if="changeStatus === 1" @click="onLoginStatus">
                        <img :src="phone_icon" alt="" class="phone_icon">
                        <span class="phone_title">手机号登录</span>
                    </p>
                    <p class="login_phone" v-if="changeStatus === 2" @click="onLoginStatus">
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
                        <input maxlength="11" v-model.trim="phone" type="text" class="qrcode_input"
                               placeholder="请输入手机号">
                    </p>
                    <p class="qrcode_item item_pwd">
                        <span class="qrcode_title">密码：</span>
                        <input maxlength="18" v-model.trim="password" @keyup.enter="onLogin" type="password"
                               class="qrcode_input" placeholder="请输入密码">
                    </p>
                    <p class="qrcode_errortip">{{errorMsg}}</p>
                    <p class="qrcode_loginbtn" @click="onLogin">登录</p>
                    <p class="qrcode_register">
                        <nuxt-link :to="`/`" class="qrcode_forgetpwd"></nuxt-link>
                        <nuxt-link :to="`/register`" class="qrcode_forgetpwd">注册</nuxt-link>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
  // 插件
  import axios from "~/plugins/axios";
  import QRCode from "qrcode";
  // 组件
  import navbar_logo from "~/static/img/home/navbar_logo.png";
  import qr_icon from "~/static/img/home/qr_icon.png";
  import phone_icon from "~/static/img/home/phone_icon.png";
  import {
    EMPLOYEE_READ,
    ENTERPRISE_MANAGER,
    CHECK_TOTAL_READ,
    NOTIFICATION,
    AUTHORITY
  } from "~/utils/authority";

  // 文件
  let timeout = "";
  export default {
    props: ["isSetOpacity"],
    components: {},
    data() {
      return {
        navbar_logo,
        backgroundColor: "rgba($color: #000000, $alpha: 0.23)",
        qr_icon,
        changeStatus: 1,
        status: 1,
        phone_icon,
        hoverindex: -1,
        isDisplay: "none",
        bunchList: [
          {
            href: "/workbunch/checkstatistic",
            title: "考勤统计",
            permissions: CHECK_TOTAL_READ,
            itemList: [
              {
                href: "/workbunch/checkstatistic/checkdaily",
                title: "每日考勤"
              },
              {
                href: "/workbunch/checkstatistic",
                title: "考勤统计"
              }
            ]
          },
          {
            href: "/workbunch/empmanagement",
            title: "员工管理",
            permissions: EMPLOYEE_READ,
            itemList: [
              {
                href: "/workbunch/empmanagement",
                title: "员工审核"
              },
              {
                href: "/workbunch/empmanagement/department",
                title: "部门管理"
              }
            ]
          },
          {
            href: "/workbunch/busmanagement",
            title: "企业管理",
            permissions: ENTERPRISE_MANAGER
          },
          {
            href: "/workbunch/notification",
            title: "发布通知",
            permissions: NOTIFICATION
          },
          // {
          //   href: "/workbunch/cardsetting",
          //   title: "打卡设置"
          // },
          {
            href: "/workbunch/authority",
            title: "权限控制",
            permissions: AUTHORITY
          }
        ],
        spunchStatus: 2,
        activeIndex: "3",
        phone: "",
        password: "",
        errorMsg: "",
        uid: null,
        imgUrl: "",
        permissions: 0,
        name: "",
        identity: ""
      };
    },
    computed: {
      getUserInfo() {
        return this.$store.state.login.userInfo;
      }
    },
    watch: {
      getUserInfo(val) {
        if (val === null) {
          this.onLogout();
        }
      }
    },
    mounted() {
      const {isSetOpacity} = this;
      this.getEcode();
      let userInfo = this.$store.state.login.userInfo;
      let permissions = userInfo ? userInfo.permissions : 0;
      let uid = userInfo ? userInfo.uid : null;
      let name = userInfo ? userInfo.name : null;
      this.permissions = permissions;
      this.uid = uid;
      this.name = name;
      this.backgroundColor =
        isSetOpacity === true ? "rgba(0, 0, 0, 0.23)" : "rgba(0, 0, 0, 1)";
    },
    destroyed() {
      clearInterval(timeout);
    },
    methods: {
      // 登录
      async onLogin() {
        const {phone, password} = this;
        const reg = /^1[3|4|5|6|7|8][0-9]\d{4,8}$/;
        if (phone === "" || phone.length < 11 || !reg.test(phone)) {
          this.errorMsg = "手机号或密码有误";
          return false;
        } else if (password === "") {
          this.errorMsg = "手机号或密码有误";
          return false;
        } else {
          this.errorMsg = "";
          let loginInfo;
          loginInfo = await axios.get("/pcapi/user/login", {
            params: {
              phone,
              password
            }
          });
          const {data} = loginInfo;
          if (data.code === 0) {
            this.$store.dispatch("setUser", data.data);
            this.$router.push("/usercenter");
          } else {
            this.errorMsg = "手机号或密码有误";
          }
        }
      },
      // 切换登录方式
      async onLoginStatus() {
        const {changeStatus} = this;
        if (changeStatus === 2) {
          this.changeStatus = 1;
        } else {
          this.changeStatus = 2;
        }
      },
      // 请登录
      async onChangeStatus() {
        const {status, identity} = this;
        if (status === 1) {
          this.status = 2;
          let loginInfo;
          let loginInitial;
          let expiryTime = 1;
          loginInitial = await axios.get("/pcapi/user/qr_login_initial", {
            params: {
              identity
            }
          });
          timeout = setInterval(async () => {
            loginInfo = await axios.get("/pcapi/user/qr_login_web", {
              params: {
                identity,
                time: new Date().getTime()
              }
            });
            const {data} = loginInfo;
            if (data.code === 0) {
              this.$store.dispatch("setUser", data.data);
              this.$router.push("/usercenter");
            }
            expiryTime++;
            if (expiryTime > 120) {
              this.getEcode();
              expiryTime = 1;
            }
          }, 1000);
        } else {
          this.status = 1;
          clearTimeout(timeout);
        }
      },
      // 调用登录二维码
      async getEcode() {
        // dakaApp-chat: 时间戳10位-ip-随机数
        const date = Date.parse(new Date())
          .toString()
          .substr(0, 10);
        const math = Math.floor(Math.random().toFixed(2) * 100);
        let ip = await axios.get("/pcapi/ip");

        // const ip = `${Math.floor(Math.random() * 900)}.${Math.floor(Math.random() * 900)}.${Math.floor(Math.random() * 900)}.${Math.floor(Math.random() * 900)}`
        const identity = `dakaApp-chat:${date}-${ip.data}-${math}`;
        this.identity = identity;
        // 自动生成二维码
        let opts = {
          errorCorrectionLevel: "H",
          type: "image/png",
          color: {
            dark: "#333"
          }
        };
        QRCode.toDataURL(identity, opts)
          .then(url => {
            this.imgUrl = url;
          })
          .catch(err => {
            console.erros(err);
          });
      },
      // 退出登录
      async onLogout() {
        let logoutInfo = await axios.get("/pcapi/logout");
        const {data} = logoutInfo;
        if (data === 200) {
          this.uid = null;
          this.$store.dispatch("logout");
          this.$router.push("/");
        }
      }
    }
  };
</script>
<style lang="scss">
    .el-menu--horizontal {
        border: none;
        .el-menu--popup {
            padding: 32px 0;
            min-width: 160px;
            width: 160px;
            top: -14px;
            left: -44px;
            background-color: #ffffff;
            box-shadow: 0px 2px 10px 0px rgba(0, 24, 148, 0.3);
            border-radius: 4px;
            margin-left: 16px;
            .el-menu-item {
                height: auto;
                text-align: center;
                margin: 0;
                padding: 0;
                margin-bottom: 36px;
                line-height: 16px;
                min-width: 160px;
                font-size: 16px;
                color: #333333;
                background: none;
                &:last-child {
                    margin: 0;
                }
                a {
                    font-size: 16px;
                    color: #333333;
                    margin-right: 14px;
                    &:hover {
                        color: #5ea1ff;
                    }
                }
            }
            .el-submenu {
                margin-bottom: 36px;
                .el-submenu__title {
                    display: flex;
                    justify-content: center;
                    height: auto;
                    line-height: 16px;
                    font-size: 16px;
                    color: #333333;
                    margin-right: 14px;
                    &:hover {
                        color: #5ea1ff;
                        i {
                            color: #5ea1ff;
                        }
                    }
                    i {
                        color: #333333;
                        width: 13px;
                        height: 13px;
                        font-size: 13px;
                        &::before {
                            content: "\E60E";
                        }
                    }
                }
                .el-menu--horizontal {
                    position: absolute !important;
                    top: 14px !important;
                    left: 198px !important;
                    .el-menu--popup {
                        min-width: 120px;
                        width: 120px;
                        .el-menu-item {
                            min-width: 120px;
                        }
                    }
                    a {
                        margin: 0;
                    }
                }
            }
        }
    }

    .navbar {
        height: 66px;
        color: white;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 4;
        // background-color: rgba(0, 0, 0, 0.23)
        .navbar_box {
            display: flex;
            justify-content: space-between;
            position: relative;
            .navbar_box_l {
                display: flex;
                .navbar_name {
                    margin-right: 54px;
                    .navbar_name_link {
                        display: flex;
                        align-items: center;
                        height: 68px;
                        .navbar_icon {
                            margin-right: 10px;
                            width: 33px;
                            height: 40px;
                        }
                        .navbar_title {
                            font-size: 28px;
                            color: white;
                        }
                    }
                }
                .el-menu--horizontal {
                    position: relative;
                    background: none;
                    border: none;
                    margin: 0;
                    .el-submenu {
                        .navbar_link.nuxt-link-active {
                            &:after {
                                content: '';
                                display: block;
                                position: absolute;
                                bottom: 16px;
                                left: 18px;
                                right: 18px;
                                height: 4px;
                                background-color: #78D0FF;
                                border-radius: 4px;
                            }
                        }
                    }

                    .el-menu-item {
                        height: 68px;
                        line-height: 68px;
                        color: white;
                        font-size: 16px;
                        margin-right: 48px;
                        border-bottom: none;
                        background: none;
                        &:hover {
                            background: none;
                        }
                        .navbar_link.nuxt-link-exact-active.nuxt-link-active {
                            &:after {
                                content: '';
                                display: block;
                                position: absolute;
                                bottom: 16px;
                                left: 18px;
                                right: 18px;
                                height: 4px;
                                background-color: #78D0FF;
                                border-radius: 4px;
                            }
                        }
                        // a{
                        //   &:hover{
                        //     color: #5ea1ff;
                        //   }
                        // }
                    }
                    .el-submenu {
                        margin-right: 48px;
                        .el-submenu__title {
                            height: 68px;
                            line-height: 68px;
                            color: white;
                            font-size: 16px;
                            border: none;
                            &:hover {
                                background: none;
                            }
                            i {
                                color: #333333;
                                width: 13px;
                                height: 13px;
                                font-size: 13px;
                                color: white;
                                &::before {
                                    content: "\E60B";
                                }
                            }
                        }
                    }
                }
                .navbar_ul {
                    display: flex;
                    align-items: center;
                    .navbar_li {
                        margin-right: 88px;
                        position: relative;
                        .navbar_link {
                            font-size: 16px;
                            color: white;
                            span {
                                display: inline-block;
                                height: 68px;
                                line-height: 68px;
                            }
                        }
                        .navbar_workbunch {
                            width: 160px;
                            height: 360px;
                            background-color: #ffffff;
                            box-shadow: 0px 2px 10px 0px rgba(0, 24, 148, 0.3);
                            border-radius: 4px;
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: center;
                            position: absolute;
                            left: -52px;
                            top: 58px;
                            padding: 32px 0;
                            .workbunch_list {
                                display: inline-block;
                                font-size: 16px;
                                line-height: 16px;
                                color: #333333;
                                position: relative;
                                width: 100%;
                                text-align: center;
                                line-height: 50px;
                                &:first-child {
                                    &::after {
                                        content: "";
                                        position: absolute;
                                        top: 3px;
                                        right: -16px;
                                        width: 0;
                                        height: 0;
                                        border-left: 5px solid #333333;
                                        border-top: 4px solid transparent;
                                        border-bottom: 4px solid transparent;
                                    }
                                }
                                &:nth-child(2) {
                                    &::after {
                                        content: "";
                                        position: absolute;
                                        top: 3px;
                                        right: -16px;
                                        width: 0;
                                        height: 0;
                                        border-left: 5px solid #333333;
                                        border-top: 4px solid transparent;
                                        border-bottom: 4px solid transparent;
                                    }
                                }
                                span {
                                    display: inline-block;
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                        .navbar_child_workbunch {
                            width: 160px;
                            background-color: #ffffff;
                            box-shadow: 0px 2px 10px 0px rgba(0, 24, 148, 0.3);
                            border-radius: 4px;
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: center;
                            position: absolute;
                            left: 118px;
                            top: 58px;
                            padding: 32px 0;
                            .workbunch_list {
                                display: inline-block;
                                font-size: 16px;
                                line-height: 16px;
                                color: #333333;
                                position: relative;
                                margin-bottom: 40px;
                                &:last-child {
                                    margin: 0;
                                }
                            }
                        }
                    }
                }
            }
            .navbar_box_r {
                display: flex;
                align-items: center;
                font-size: 14px;
                .logout {
                    margin-left: 14px;
                    cursor: pointer;
                }
                .username {
                    font-weight: bold;
                    cursor: pointer;
                    a {
                        color: white;
                    }
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
    }
</style>