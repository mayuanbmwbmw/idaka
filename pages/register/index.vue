<template>
    <section class="register">
        <div class="register_box">
            <div class="register_top">
                <nuxt-link class="register_l" :to="`/`">
                    <img :src="navbar_logo" alt="" class="navbar_icon">
                    <span class="navbar_title">打卡助手</span>
                </nuxt-link>
                <nuxt-link class="register_back" :to="`/`">返回首页</nuxt-link>
            </div>
            <div class="register_form">
                <div class="register_list">
                    <span class="register_name">手机号</span>
                    <span class="register_star">*</span>
                    <input type="tel" v-model.trim="phone" maxlength="11" class="register_input" placeholder="请输入手机号">
                </div>
                <div class="register_list" style="position: relative">
                    <span class="register_name">短信验证码</span>
                    <span class="register_star">*</span>
                    <input type="tel" v-model.trim="vcode" class="register_input register_msg" placeholder="请输入短信验证码">
                    <span class="send_code" style="position: absolute;right: 0;top: 0"
                          @click="sendCode">{{ timer }}</span>
                </div>
                <div class="register_list">
                    <span class="register_name">设置密码</span>
                    <span class="register_star">*</span>
                    <input type="password" v-model.trim="pass" class="register_input" placeholder="请输入密码">
                </div>
                <div class="register_list">
                    <span class="register_name">确认密码</span>
                    <span class="register_star">*</span>
                    <input type="password" v-model.trim="password" class="register_input" placeholder="请再次输入密码">
                </div>
                <div class="register_list">
                    <span class="register_name">姓名/昵称</span>
                    <span class="register_star">*</span>
                    <input v-model.trim="name" type="tel" class="register_input" placeholder="请输入姓名">
                </div>
                <!--<div class="register_list">-->
                <!--<span class="register_name">工号</span>-->
                <!--<span class="register_star">*</span>-->
                <!--<input v-model.trim="work_number" type="tel" class="register_input" placeholder="请输入你的工号">-->
                <!--</div>-->
                <p class="xieyi">注册即视为同意 <a href="javascript:;" @click="xieyidialogVisible = true">《打卡助手用户协议》</a></p>
                <p class="register_btn" @click="register">注册</p>
            </div>
        </div>

        <el-dialog
                title=" "
                :visible.sync="xieyidialogVisible"
                width="1000px"
                class="xieyidialog"
        >
            <div class="xieyimain">
                <p class="xieyi_head">《打卡助手用户协议》</p>
                <p class="xieyi_duanluo">
                    一、总则<br>
                    1.1.打卡助手(以下简称本站)的所有权和运营权归卓朗科技有限公司(以下简称卓朗)所有。<br>
                    1.2.用户在注册之前，应当仔细阅读本协议，并同意遵守本协议后方可注册用户。一但注册成功，则用户与打卡助手之间自动形成协议关系，用户应当受本协议的约束。用户使用特殊的服务或产品时，应当同意接受相关协议后方可使用。<br>
                    1.3.本协议则可由打卡助手随时更新，用户应当及时关注并同意本站并承担通知义务。本站的通知、公告、声明或其它类似内容是本协议的一部分。
                </p>
                <p class="xieyi_duanluo">
                    二、服务内容<br>
                    2.1.打卡助手的具体内容由本站根据实际情况提供。<br>
                    2.2. 本站仅提供相关的网络服务，除此之外与相关网络服务有关的设备（如个人电脑、手机、及其它与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）应由用户自行负责。
                </p>
                <p class="xieyi_duanluo">
                    三、用户账号
                    3.1. 经本站注册系统完成注册程序的用户即成为正式用户，可以获得本站规定用户所应享受的一切权限。<br>
                    3.2. 注册规范<br>
                    3.2.1. 企业（团队）名称需要以真实企业/机构/团队的名称注册<br>
                    3.2.2.禁止使用。<br>
                    3.2.2.1.带民族歧视性的。<br>
                    3.2.2.2.夸大宣传并带有欺骗性的。<br>
                    3.2.2.3.有害社会主义道德风尚或者造成不良影响的。<br>
                </p>
                <p class="xieyi_duanluo">
                    四、内容规范<br>
                    4.1. 本条所述内容是指用户使用本服务过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号头像、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复或自动回复消息和相关链接页面，以及其他使用账号或本服务所产生的内容。<br>
                    4.2. 电话回拨功能最终解释权归卓朗科技所有，有权对该功能采取免费或者有偿使用。<br>
                    4.3. 使用电话回拨功能严禁开展任何违法、违规业务，严禁进行网络诈骗、敲诈勒索，严禁拨打骚扰电话。一经发现立即停止使用该功能。<br>
                    4.4. 内容不得涉及：反对宪法所确定的基本原则的； 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的； 损害国家荣誉和利益的； 煽动民族仇恨、民族歧视，破坏民族团结的； 破坏国家宗教政策，宣扬邪教和封建迷信的； 散布谣言，扰乱社会秩序，破坏社会稳定的； 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的； 侮辱或者诽谤他人，侵害他人合法权益的； 不遵守法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的“七条底线”要求的； 含有法律、行政法规禁止的其他内容的信息。<br>
                </p>
                <p class="xieyi_duanluo">
                    天津卓朗科技发展有限公司
                </p>

            </div>
            <span slot="footer" class="dialog-footer">
                <!--<el-button @click="xieyidialogVisible = false">取 消</el-button>-->
                <el-button class="agree" type="primary" @click="xieyidialogVisible = false">同 意 并 继 续</el-button>
            </span>
        </el-dialog>
        <trfooter></trfooter>
    </section>
</template>
<script>
  // 插件
  import axios from '~/plugins/axios'

  // 组件
  import navbar from '~/components/common/navbar'
  import trfooter from '~/components/common/trfooter'

  // 文件
  import navbar_logo from '~/static/img/home/navbar_logo_register.png'

  export default {
    components: {
      navbar,
      trfooter
    },
    head() {
      return {
        title: '注册'
      }
    },
    data() {
      return {
        navbar_logo,
        name: '',
        phone: '',
        vcode: '',
        pass: '',
        password: '',
        work_number: '',
        timer: '发送验证码',
        codeStataus: 1,
        xieyidialogVisible: false,
      }
    },

    async asyncData({}) {
      try {
        return {}
      } catch (e) {
        // console.log('error', e)
      }
    },
    mounted() {
    },
    methods: {
      // 发送验证码
      async sendCode() {
        const {phone, codeStataus, name, pass, password, number, vcode} = this
        const reg = /^1[3|4|5|6|7|8][0-9]\d{4,8}$/
        if (codeStataus === 1) {
          if (phone === '' || phone.length < 11 || !reg.test(phone)) {
            this.$message({
              message: '请正确输入手机号',
              type: 'error'
            })
            return false
          } else {
            let time = 60
            let vcCode = await axios.get('/pcapi/user/getvcode', {
              params: {
                phone,
                expect: 0
              }
            })
            const {data} = vcCode
            if (data.code === 0) {
              const interval = setInterval(() => {
                if (time > -1) {
                  this.timer = `${time--}秒`
                  this.codeStataus = 0
                } else {
                  this.timer = '获取验证码'
                  this.codeStataus = 1
                  time = 60
                  clearInterval(interval)
                }
              }, 1000)
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              })
            }
          }
        }
      },
      // 注册
      async register() {
        const {phone, codeStataus, name, pass, password, work_number, vcode} = this
        const reg = /^1[3|4|5|6|7|8][0-9]\d{4,8}$/
        if (phone === '' || phone.length < 11 || !reg.test(phone)) {
          this.$message({
            message: '请正确输入手机号',
            type: 'error'
          })
        } else if (vcode === '') {
          this.$message({
            message: '请正确输入短信验证码',
            type: 'error'
          })
          return false
        } else if (pass === '' || password === '') {
          this.$message({
            message: '请正确输入手机密码',
            type: 'error'
          })
          return false
        } else if (pass !== password) {
          this.$message({
            message: '两次输入密码不一致',
            type: 'error'
          })
          return false
        } else if (name === '') {
          this.$message({
            message: '请输入真实姓名',
            type: 'error'
          })
          return false
        }
        // else if (work_number === '') {
        //   this.$message({
        //     message: '请输入你的工号',
        //     type: 'error'
        //   })
        //   return false
        // }
        else {
          // let time = 60;
          let register = await axios.get('/pcapi/user/register', {
            params: {
              phone,
              name,
              password,
              vcode,
              // work_number
            }
          })
          const {data} = register
          if (data.code === 0) {
            this.$message({
              message: '恭喜你注册成功',
              type: 'success',
              duration: 1200,
              onClose: () => {
                this.onLogin()
                this.$router.push('/')
              }
            })
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            })
          }
        }
      },
      // 登录
      async onLogin() {
        const {phone, password} = this
        let loginInfo
        loginInfo = await axios.get('/pcapi/user/login', {
          params: {
            phone,
            password
          }
        })
        const {data} = loginInfo
        if (data.code === 0) {
          this.$store.dispatch('setUser', data.data)
          this.$router.push('/usercenter')
        } else {
          this.errorMsg = '手机号或密码有误'
        }
      }
    }
  }
</script>
<style lang="scss">
    .register {
        background-color: #f1f4f8;
        .register_box {
            width: 1000px;
            margin: 0 auto;
            margin-bottom: 290px;
            .register_top {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding-top: 20px;
                .register_l {
                    display: flex;
                    align-items: center;
                    .navbar_icon {
                        width: 46px;
                        height: 54px;
                        margin-right: 10px;
                    }
                    .navbar_title {
                        font-size: 38px;
                        color: #333333;
                        cursor: pointer;
                    }
                }
                .register_back {
                    color: #026bff;
                    font-size: 14px;
                    text-decoration: underline;
                }
            }
            .register_form {
                width: 1000px;
                height: 554px;
                background-color: #ffffff;
                box-shadow: 0px 2px 10px 0px rgba(0, 24, 148, 0.3);
                border-radius: 10px;
                margin: 16px auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow: hidden;
                padding: 60px 0 84px;
                .register_list {
                    width: 396px;
                    height: 40px;
                    border-radius: 2px;
                    border: solid 1px #e9e9e9;
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    .register_name {
                        color: #333333;
                        font-size: 14px;
                        margin-left: 20px;
                        font-weight: 800;
                        width: 72px;
                    }
                    .register_star {
                        color: #ff7878;
                        font-size: 24px;
                        margin: 10px 11px 0 6px;
                    }
                    .register_input {
                        color: #333333;
                        font-size: 14px;
                        text-indent: 12px;
                        border-left: 1px solid #e9e9e9;
                    }
                    .send_code {
                        width: 89px;
                        height: 40px;
                        background-color: #026bff;
                        border-radius: 2px;
                        color: white;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: 19px;
                        cursor: pointer;
                    }
                }
                .register_btn {
                    width: 396px;
                    height: 40px;
                    background-color: #026bff;
                    border-radius: 20px;
                    font-size: 16px;
                    margin-top: 10px;
                    cursor: pointer;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .xieyi {
                    font-size: 13px;
                    color: #999;
                    margin: 10px 0 20px 0;
                    a {
                        text-decoration: underline;
                    }
                }
            }
        }

        .xieyidialog{
            /*height: 554px;*/
            .el-dialog{
                border-radius: 10px;
            }
            .el-dialog__headerbtn .el-dialog__close{
                color: #036BFF!important;
            }
            .xieyimain{
                border-radius: 3px;
                border: 1px solid #EDEDED;
                width: 888px;
                margin: 0 auto;
                line-height: 25px;
                padding: 0 30px;
                overflow-y: auto;
                height: 380px;
                .xieyi_head{
                    font-size: 18px;
                    text-align: center;
                    color: #383838;
                    line-height: 70px
                }
                .xieyi_duanluo{
                    margin-bottom: 30px;
                }
            }
            .el-dialog__body{
                padding-bottom: 0;
            }
            .el-dialog__footer{
                text-align: center;
                padding-bottom: 30px;
                .agree{
                    width: 396px;
                    height: 40px;
                    background-color: #026bff;
                    border-radius: 20px;
                    font-size: 16px;
                    margin-top: 10px;
                    cursor: pointer;
                    color: white;
                }
            }
        }
    }
</style>