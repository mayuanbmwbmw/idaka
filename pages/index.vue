<template>
    <section class="home">
        <navbar :isSetOpacity="true"></navbar>
        <div class="fixBox">
            <div class="download">
                <div class="ios">iOS
                    <div class="hoverOut">
                        <img :src="code_iOS" alt="" class="code_img">
                        <p class="code_name">iOS</p>
                    </div>
                </div>
                <div class="and">Android
                    <div class="hoverOut">
                        <img :src="code_Android" alt="" class="code_img">
                        <p class="code_name">Android</p>
                    </div>
                </div>
            </div>
            <!--<div class="module contact">咨询/反馈</div>-->
            <div class="module totop" @click="totop">返回顶部</div>
        </div>
        <div class="home_top">
            <!--<img :src="home_top_bg" alt="" class="home_top_bg">-->
            <div class="top_middle_box">
                <div class="banner_btn" @click="tobottom">下载使用&nbsp;&nbsp;&nbsp;<span>&gt;</span></div>
            </div>
            <!--<img :src="home_top_banner" alt="" class="home_top_banner">-->
        </div>
        <div class="home_middle">
            <ul class="middle_ul">
                <li class="middle_list">
                    <img :src="icon_free" alt="" class="list_logo">
                    <p class="list_title">免费</p>
                    <p class="list_subtitle">永久免费</p>
                    <p class="list_subtitle">不用花一分钱即可享用考勤管理</p>
                </li>
                <li class="middle_list">
                    <img :src="icon_fast" alt="" class="list_logo">
                    <p class="list_title">便捷</p>
                    <p class="list_subtitle">移动考勤，移动办公</p>
                    <p class="list_subtitle">抛开传统模式，让考勤办公更高效</p>
                </li>
                <li class="middle_list">
                    <img :src="icon_safe" alt="" class="list_logo">
                    <p class="list_title">安全</p>
                    <p class="list_subtitle">云服务，多平台</p>
                    <p class="list_subtitle">享受云服务的稳定，安全</p>
                </li>
            </ul>
            <p class="home_middle_title">我们将为您带来更大的利益</p>
            <p class="home_middle_subtitle">打卡助手，企业系统化、高效化的考勤办公管理平台。</p>
            <p class="home_middle_subtitle">主要服务于企业用户，帮助客户实现考勤统计、轻简办公、沟通协作、企业管理，能够极大地节省企业日常考勤、办公、沟通、管理的成本。</p>
            <!--<img :src="middle_tree" alt="" class="middle_tree">-->
        </div>
        <div class="home_bottom">
            <ul class="bottom_ul">
                <li class="bottom_list first_list">
                    <img :src="list_phone_one" alt="" class="list_phone">
                    <div class="list_punch">
                        <p class="punch_title">考勤签到</p>
                        <p class="punch_subtitle">多种打卡规则设置，内外勤一键搞定</p>
                        <img :src="kaoqinqiandao" alt="" class="punch_content">
                        <!--<p class="punch_tip">可通过左右滑动来切换上下班打卡卡片</p>-->
                    </div>
                </li>
                <li class="bottom_list second_first">
                    <div class="list_punch">
                        <p class="punch_title">日常办公</p>
                        <p class="punch_subtitle">摆脱复杂的办公流程，工作更高效</p>
                        <img :src="yunpan" alt="" class="punch_content">
                        <!--<p class="punch_tip">可通过左右滑动来查看其他月份的考勤</p>-->
                    </div>
                    <img :src="list_phone_two" alt="" class="list_phone">
                </li>
                <li class="bottom_list third_list">
                    <img :src="list_phone_three" alt="" class="list_phone">
                    <div class="list_punch">
                        <p class="punch_title">通讯录</p>
                        <p class="punch_subtitle">人员结构明了，让办公更流畅</p>
                    </div>
                </li>
                <li class="bottom_list foutrh_first">
                    <div class="list_punch">
                        <p class="punch_title">沟通</p>
                        <p class="punch_subtitle">聊天，免费通话，视频会议，多种方式<br>实现您的高效沟通</p>
                        <!--<p class="punch_tip">打卡设置可以让打卡定位更精准</p>-->
                    </div>
                    <img :src="list_phone_four" alt="" class="list_phone">
                </li>
            </ul>
        </div>
        <div class="home_client">
            <p class="client_title">更多精彩，请下载客户端</p>
            <ul class="client_ul">
                <li class="client_code">
                    <div>
                        <img :src="code_iOS" alt="" class="code_img">
                    </div>
                    <p class="code_name">iOS<br><span>扫描二维码下载</span></p>
                </li>
                <li class="client_code">
                    <div>
                        <img :src="code_Android" alt="" class="code_img">
                    </div>
                    <p class="code_name">Android<br><span>扫描二维码下载</span></p>
                </li>
                <li class="client_code">
                    <div>
                        <img :src="code_Wechat" alt="" class="code_img">
                    </div>
                    <p class="code_name">微信小程序<br><span>微信扫描二维码</span></p>
                </li>
                <li class="client_code">
                    <div class="pcdownload windows" @click="dlwindows"></div>
                    <div class="pcdownload mac" @click="dlmac"></div>
                    <div class="pcdownload linux" @click="dllinux"></div>
                </li>
            </ul>
            <p class="client_line"></p>
        </div>
        <trfooter></trfooter>
    </section>
</template>
<script>
  // 插件
  import axios from '~/plugins/axios'
  import qs from 'qs'

  // 组件
  import navbar from '~/components/common/navbar'
  import trfooter from '~/components/common/trfooter'
  // import { authority } from '~/utils/authority'

  // 文件

  import home_top_banner from '~/static/img/home/home_top_banner.png'
  import home_top_bg from '~/static/img/home/home_top_bg.png'
  import icon_free from '~/static/img/home/icon_free.png'
  import icon_fast from '~/static/img/home/icon_fast.png'
  import icon_safe from '~/static/img/home/icon_safe.png'
  import middle_tree from '~/static/img/home/middle_tree.png'
  import list_phone_one from '~/static/img/home/list_phone_one.png'
  import list_phone_two from '~/static/img/home/list_phone_two.png'
  import list_phone_three from '~/static/img/home/list_phone_three.png'
  import list_phone_four from '~/static/img/home/list_phone_four.png'
  import code_iOS from '~/static/img/home/code_iOS.png'
  import code_Android from '~/static/img/home/code_Android.png'
  import code_Wechat from '~/static/img/home/code_Wechat.png'
  import kaoqinqiandao from '~/static/img/home/kaoqinqiandao.png'
  import yunpan from '~/static/img/home/yunpan.png'

  export default {
    components: {
      navbar,
      trfooter
    },
    head () {
      return {
        title: '打卡助手_一款基于位置服务的上下班打卡应用'
      }
    },
    data () {
      return {
        home_top_banner,
        home_top_bg,
        icon_free,
        icon_fast,
        icon_safe,
        middle_tree,
        list_phone_one,
        list_phone_two,
        list_phone_three,
        list_phone_four,
        code_iOS,
        code_Android,
        code_Wechat,
        kaoqinqiandao,
        yunpan
      }
    },

    // 初始化
    // async asyncData({ req, store }) {
    //   try {
    //     let token = store.state.login.token
    //     return {
    //     }
    //   } catch (e) {
    //     console.log("error", e);
    //   }
    // },
    mounted () {
      if (window.navigator.appName === 'Microsoft Internet Explorer' && parseInt(window.navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', '')) < 10) {
        // alert('浏览器版本过低，无法正常使用，建议您使用Chrome、360等浏览器或升级最新版本浏览器')
        this.$alert('浏览器版本过低，无法正常使用，建议您使用Chrome、360等浏览器或升级最新版本浏览器', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${action}`
            // })
          }
        })
      }
      const source = qs.parse(location.search.split('?')[1]).source
      source && axios.get('/pcapi/user_manage/rememberwhocamehere', {
        params: {
          source
        }
      })
    },
    methods: {
      totop () {
        $('html,body').animate({scrollTop: '0px'}, 400)
      },
      tobottom () {
        $('html,body').animate({scrollTop:$('.home_client').offset().top}, 400)
      },
      dlwindows() {
        window.open('https://www.idaka.vip/upload/dakaapp.exe')
      },
      dlmac() {
        window.open('https://www.idaka.vip/upload/dakaapp.dmg')
      },
      dllinux() {
        window.open('https://www.idaka.vip/upload/dakaapp.AppImage')
      },
    }
  }
</script>
<style lang="scss" scoped>
    .home {
        position: relative;
        .fixBox {
            position: fixed;
            top: 30%;
            right: 2%;
            z-index: 2;
            .download {
                box-sizing: border-box;
                width: 100px;
                height: 170px;
                padding: 15px;
                text-align: center;
                /*background:linear-gradient(-36deg,rgba(239,128,255,1) 0%,rgba(0,153,255,1) 100%);*/
                background: rgba(0, 0, 0, .5);
                /*opacity:0.8;*/
                border-radius: 10px;
                & > div {
                    position: relative;
                    height: 70px;
                    font-size: 15px;
                    color: rgba(255, 255, 255, 1);
                    font-weight: 600;
                    line-height: 6px;
                    cursor: pointer;
                    &:hover .hoverOut {
                        display: block;
                    }
                }
                .ios {
                    background: url(~/static/img/home/ios.png) no-repeat center top;
                    padding-top: 50px;
                    border-bottom: 1px solid #fff;
                    .hoverOut {
                        top: -15px;
                        &:after {
                            top: 41px;
                        }
                    }
                }
                .and {
                    background: url(~/static/img/home/android.png) no-repeat center 10px;
                    padding-top: 60px;
                    .hoverOut {
                        bottom: -15px;
                        &:after {
                            bottom: 41px;
                        }
                    }
                }
                .hoverOut {
                    display: none;
                    position: absolute;
                    padding: 10px;
                    left: -165px;
                    width: 143px;
                    height: 170px;
                    background: rgba(0, 0, 0, .5);
                    border-radius: 10px;
                    img {
                        width: 100%;
                    }
                    p {
                        padding-top: 10px;
                        font-size: 18px;
                        font-weight: 100;
                        color: rgba(255, 255, 255, 1);
                        line-height: 15px;
                    }
                    &:after {
                        content: '';
                        display: block;
                        position: absolute;
                        right: -10px;
                        width: 0;
                        height: 0;
                        border: 5px solid transparent;
                        border-left-color: rgba(0, 0, 0, .5);
                    }
                }
            }
            .module {
                width: 100px;
                height: 76px;
                border-radius: 10px;
                margin-top: 20px;
                padding-top: 48px;
                font-size: 15px;
                color: rgba(255, 255, 255, 1);
                font-weight: 600;
                text-align: center;
                cursor: pointer;
                &.contact {
                    background: rgba(0, 0, 0, .5) url(~/static/img/home/kefu.png) no-repeat center 10px;
                }
                &.totop {
                    background: rgba(0, 0, 0, .5) url(~/static/img/home/totop.png) no-repeat center 20px;
                }
            }

        }
        .home_top {
            overflow: hidden;
            /*width: 100%;*/
            /*height: 782px;*/
            /*position: absolute;*/
            /*top: 0;*/
            /*left: 0;*/
            background: url(~/static/img/home/home_top_bg.png) no-repeat center 0;
            /*background-size: 100% 100%;*/
            .home_top_bg {
                position: absolute;
                top: 0;
                left: 0;
                /*width: 100%;*/
                height: 782px;
            }
            .top_middle_box {
                display: block;
                width: 1180px;
                height: 700px;
                margin: 0 auto;
                margin-top: 150px;
                background: url(~/static/img/home/home_top_banner.png) no-repeat center 0;
                position: relative;
                .banner_btn {
                    position: absolute;
                    right: 380px;
                    top: 350px;
                    padding: 12px 30px;
                    border-radius: 100px;
                    background-color: #fff;
                    font-size: 19px;
                    font-weight: bold;
                    color: #0553B5;
                    cursor: pointer;
                    -webkit-transition: all 0.3s;
                    transition: all 0.3s;
                    min-width: 170px;
                    text-align: center;
                    span {
                        font-weight: normal;
                    }
                    &:hover {
                        background-color: #F0FAFF;
                    }
                }
            }
            .home_top_banner {
                display: block;
                width: 1180px;
                margin: 150px auto 0;
                position: relative;
                left: -64px;
            }
        }
        .home_middle {
            text-align: center;
            position: relative;
            top: -38px;
            .home_middle_title {
                color: #1c2042;
                font-size: 28px;
                line-height: 28px;
                margin-bottom: 40px;
                font-weight: bold;
                margin-top: 115px;
                font-family: MicrosoftYaHei-Bold;
            }
            .home_middle_subtitle {
                font-size: 16px;
                color: #999999;
            }
            .middle_ul {
                width: 998px;
                margin: 60px auto 0;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                .middle_list {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    &:first-child {
                        .list_logo {
                            width: 204px;
                            height: 124px;
                        }
                    }
                    &:nth-child(2) {
                        .list_logo {
                            width: 110px;
                            height: 165px;
                        }
                    }
                    &:last-child {
                        .list_logo {
                            width: 177px;
                            height: 112px;
                        }
                    }
                    .list_title {
                        font-size: 18px;
                        line-height: 18px;
                        margin: 15px 0 12px;
                        color: #333;
                        font-family: MicrosoftYaHei-Bold;
                        font-weight: bold;
                    }
                    .list_subtitle {
                        font-size: 16px;
                        color: #999999;
                    }
                }
            }
            .middle_tree {
                width: 1192px;
                margin-top: 42px;
            }
        }
        .home_bottom {
            margin: 0 auto;
            padding-bottom: 100px;
            .bottom_ul {
                .list_punch {
                    width: 400px;
                    margin-top: 70px;
                    .punch_title {
                        position: relative;
                        font-size: 28px;
                        line-height: 28px;
                        color: #333;
                        font-family: MicrosoftYaHei-Bold;
                        font-weight: bold;
                        &:after {
                            content: '';
                            display: inline-block;
                            width: 60px;
                            height: 8px;
                            border-radius: 8px;
                            background-color: #586BFB;
                            position: absolute;
                            top: -18px;
                        }
                    }
                    .punch_subtitle {
                        font-size: 16px;
                        line-height: 16px;
                        margin: 13px 0 30px;
                        color: #999;
                        line-height: 22px
                    }
                    .punch_tip {
                        color: #026bff;
                        font-size: 16px;
                        padding: 11px 16px;
                        line-height: 16px;
                        text-align: center;
                        border: 1px solid #026bff;
                        border-radius: 4px;
                    }
                    .punch_content {
                        max-width: 100%;
                    }
                }
                .first_list {
                    display: flex;
                    margin: 0 auto;
                    width: 1000px;
                    margin-top: 80px;
                    position: relative;
                    /*left: 66px;*/
                    .list_phone {
                        /*width: 402px;*/
                        /*height: 475px;*/
                        max-height: 586px;
                    }
                    .list_punch {
                        // margin-left: -94px;
                        // margin-top: 80px;
                        /*width: 400px;*/
                        margin-left: 50px;
                        /*margin-top: 70px;*/
                        .punch_title {
                            padding-left: 20px;
                            &:after {
                                left: 20px;
                            }
                        }
                        .punch_subtitle {
                            padding-left: 20px;
                        }
                        .punch_tip {
                        }
                    }
                }
                .second_first, .foutrh_first {
                    display: flex;
                    margin: 0 auto;
                    width: 1000px;
                    margin-top: 130px;
                    position: relative;
                    .list_phone {
                        /*width: 227px;*/
                        /*height: 471px;*/
                        max-height: 586px;
                    }
                    .list_punch {
                        /*margin-right: 144px;*/
                        text-align: right;
                        margin-top: 110px;
                        margin-right: 50px;
                        .punch_title {
                            padding-right: 20px;
                            &:after {
                                right: 20px;
                            }
                        }
                        .punch_subtitle {
                            padding-right: 20px;
                        }
                    }
                }
                .foutrh_first {
                    .list_punch {
                        margin-top: 150px;
                    }
                }
                .third_list {
                    display: flex;
                    margin: 0 auto;
                    width: 1000px;
                    margin-top: 130px;
                    position: relative;
                    .list_phone {
                        /*width: 227px;*/
                        /*height: 471px;*/
                    }
                    .list_punch {
                        margin-top: 150px;
                        margin-left: 50px;
                        .punch_title {
                            padding-left: 20px;
                            &:after {
                                left: 20px;
                            }
                        }
                        .punch_subtitle {
                            padding-left: 20px;
                        }
                    }
                }
                .foutrh_first {
                    position: relative;
                    left: 44px;
                }
            }
        }
        .home_client {
            padding: 43px 0 0;
            text-align: center;
            background-color: #f1f4f8;
            .client_title {
                color: #505761;
                font-size: 28px;
                line-height: 28px;
                font-family: MicrosoftYaHei-Bold;
                font-weight: bold;
            }
            .client_ul {
                display: flex;
                justify-content: center;
                margin: 0 auto;
                margin-top: 54px;
                margin-bottom: 50px;
                max-width: 1200px;
                .client_code {
                    flex: 1;
                    & > div {
                        display: inline-block;
                        width: 153px;
                        height: 153px;
                        padding: 12px 14px;
                        background-color: #ffffff;
                        border-radius: 10px;
                    }
                    .code_img {
                        width: 124px;
                        height: 124px;
                    }
                    .code_name {
                        color: #333;
                        font-size: 18px;
                        line-height: 18px;
                        margin-top: 20px;
                        span{
                            font-size: 14px;
                            line-height: 28px;
                            color: #666;
                        }
                    }
                    .pcdownload{
                        width: 190px;
                        height: 40px;
                        line-height: 40px;
                        font-size: 18px;
                        border-radius: 10px;
                        margin-bottom: 10px;
                        padding: 0 0 0 50px;
                        text-align: left;
                        color: #5C626C;
                        cursor: pointer;
                        transition: all .3s;
                        &.windows{
                            background: #fff url(~/static/img/home/pc-windows.png) no-repeat 12px center;
                            &:after{
                                content: 'Windows 下载';
                            }
                        }
                        &.mac{
                            background: #fff url(~/static/img/home/pc-mac.png) no-repeat 12px center;
                            &:after{
                                content: 'Mac 下载';
                            }
                        }
                        &.linux{
                            background: #fff url(~/static/img/home/pc-linux.png) no-repeat 12px center;
                            &:after{
                                content: 'Linux 下载';
                            }
                        }
                        &:hover{
                            background: #EAEAEA url(~/static/img/home/pc-download.png) no-repeat 12px center;
                            &:after{
                                content: '点击直接下载';
                            }
                        }
                    }
                }
                .client_code_m {
                    margin: 0 123px;
                }
            }
            .client_line {
                height: 1px;
                width: 1200px;
                margin: 0 auto;
                background-color: #d3d8e0;
            }
        }
    }
</style>