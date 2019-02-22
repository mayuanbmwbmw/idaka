<template>
    <div class="mobile">
        <div class="head" :class="[{'show' : showBuger},{'scrolldown': scrolldown}]">
            <div class="logo fl"></div>
            <div class="burger fr" @click="showBuger ? (showBuger = false) : (showBuger = true)"></div>
            <div class="hurger-hide" v-show="showBuger">
                <ul>
                    <li><a href="#whychose" @click="towhyChose">为什么选择打卡助手</a></li>
                    <li><a href="#detail" @click="todetail">功能简介</a></li>
                    <li><a href="#download" @click="todownload">下载应用</a></li>
                </ul>
            </div>
        </div>
        <div class="body">
            <div class="banner">
                <!--<img :src="banner" alt="">-->
                <div class="bannerContent">
                    <div class="btnBox" id="whychose">
                        <div class="downloadBtn ios mr-20 mb-10" @click="openI">iOS</div>
                        <div class="downloadBtn android" @click="openA">Android</div>
                    </div>
                </div>

            </div>
            <!--<div class="article t-a-c mt-50">-->
                <!--<p class="title">为什么选择打卡助手</p>-->
                <!--<p class="content">打卡助手是一款基于位置服务的上下班打卡应用，该应用主要针对企业用户，用户可以以企业或者个人为单位在手机上进行用户注册和系统设置</p>-->
            <!--</div>-->
            <!--为何选择-->
            <div class="whychose">
                <ul>
                    <li>
                        <div class="img"></div>
                        <div class="article t-a-l">
                            <p class="title">免费</p>
                            <p class="content">不用花一分钱即可<br>享用考勤管理</p>
                        </div>
                    </li>
                    <li>
                        <div class="img"></div>
                        <div class="article t-a-l">
                            <p class="title">便捷</p>
                            <p class="content">移动考勤，移动办公，抛开传<br>统模式，让考勤办公更高效</p>
                        </div>
                    </li>
                    <li>
                        <div class="img"></div>
                        <div class="article t-a-l">
                            <p class="title">安全</p>
                            <p class="content">云服务，多平台<br>享受云服务的稳定，安全</p>
                        </div>
                    </li>
                </ul>
                <!--<div class="cutt" id="detail"></div>-->
            </div>
            <!--产品详情-->
            <div class="detail">
                <ul>
                    <li>
                        <div class="article mt-40">
                            <p class="title">考勤签到</p>
                            <p class="content">多种打卡规则设置，内外勤一键搞定</p>
                        </div>
                    </li>
                    <li>
                        <div class="article mt-90">
                            <p class="title">日常办公</p>
                            <p class="content">摆脱复杂的办公流程，工作更高效</p>
                        </div>
                    </li>
                    <li>
                        <div class="article mt-90">
                            <p class="title">通讯录</p>
                            <p class="content">人员结构明了，让办公更流畅</p>
                        </div>
                    </li>
                    <li>
                        <div class="article mt-90">
                            <p class="title">沟通</p>
                            <p class="content">聊天，免费通话，视频会议，多种方式<br>实现您的高效沟通</p>
                        </div>
                    </li>
                </ul>
            </div>
            <!--下载-->
            <div class="download" id="download">
                <p class="title">更多精彩，请下载客户端</p>
                <div class="downloadBtn ios" @click="openI">iOS</div>
                <div class="downloadBtn android" @click="openA">Android</div>
                <p class="foot">版权所有 © 天津卓朗科技发展有限公司 2018 TROILA.Inc. 保留一切权利。 津ICP备10200312号-16</p>
            </div>
        </div>

    </div>
</template>
<script>
  // 插件
  // import axios from '~/plugins/axios'

  // 组件
  // import navbar from '~/components/common/navbar'

  // 文件
  import banner from '~/static/img/mobile/bannercontent.png'

  export default {
    components: {},
    head() {
      return {
        title: "卓朗科技_打卡助手"
      };
    },
    data() {
      return {
        // banner,
        showBuger: false,
        scrolldown:false,
        banner,
      };
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
    mounted() {
      // $('html,body').on()
    },
    methods: {
      openI() {
        window.open(
          "https://itunes.apple.com/cn/app/da-ka-zhu-shou/id563091001?mt=8",
          "_self"
        );
      },
      openA() {
        window.open(
          "http://sj.qq.com/myapp/detail.htm?apkName=com.zl.daka",
          "_self"
        );
      },
      towhyChose() {
        this.showBuger = false
        $('html,body').animate({scrollTop: $('.whychose').offset().top}, 400)
      },
      todetail() {
        this.showBuger = false
        $('html,body').animate({scrollTop: $('.detail').offset().top}, 400)
      },
      todownload() {
        this.showBuger = false
        // const that = this
        // $('.hurger-hide').fadeOut(400)
        $('html,body').animate({scrollTop: $('.download').offset().top}, 400)
      },
    },
    mounted() {
      const that = this
      $(window).scroll(function () {
        // console.log($(window).scrollTop())
        that.scrolldown = $(window).scrollTop() > 100
      })
    }
  };
</script>
<style lang="scss" scoped>
    .mobile {
        font-family: PingFang-SC-Medium;
        .head {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            z-index: 1;
            height: 60px;
            padding: 10px 10px;
            transition: all .4s;
            &.scrolldown{
                background: rgba(0, 0, 0, 0.4);
            }
            &.show {
                height: auto;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                .burger {
                    background: url("../../static/img/mobile/关闭菜单按钮@2x.png") no-repeat center / contain;
                }
            }

            .logo {
                width: 137px;
                height: 43px;
                background: url("../../static/img/mobile/logo@2x.png") no-repeat center /
        contain;
                background-size: 100%;
            }
            .burger {
                width: 26px;
                height: 18px;
                margin-top: 11px;
                background: url("../../static/img/mobile/菜单按钮.png") no-repeat center /
        contain;
            }
            .hurger-hide {
                margin-top: 70px;
                ul > li {
                    font-size: 1.4em;
                    margin-bottom: 30px;
                    padding-left: 10px;
                    a {
                        color: #fff;
                    }
                }
            }
        }
        .body {
            .downloadBtn {
                /*display: inline-block;*/
                width: 133px;
                height: 33px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(0, 80, 180, 1);
                border-radius: 49px;
                font-size: 1.3em;
                font-weight: 800;
                color: rgba(0, 80, 180, 1);
                line-height: 31px;
            }
            .downloadBtn:after {
                content: "";
                float: right;
                margin-right: 10px;
                width: 7px;
                height: 100%;
                background: url("../../static/img/mobile/进入蓝@2x.png") no-repeat center /
        100%;
            }
            .downloadBtn.ios:before {
                content: "";
                float: left;
                margin-left: 10px;
                width: 13px;
                height: 96%;
                background: url("../../static/img/mobile/Applelogo@2x.png") no-repeat center / 100%;
            }
            .downloadBtn.android:before {
                content: "";
                float: left;
                margin-left: 10px;
                width: 13px;
                height: 96%;
                background: url("../../static/img/mobile/Android@2x.png") no-repeat center /
        100%;
            }
            .article {
                padding: 0 25px;
                &.pr-0 {
                    padding-right: 0;
                }
                &.pl-0 {
                    padding-left: 0;
                }
                .title {
                    position: relative;
                    font-size: 1.5em;
                    font-weight: 800;
                    color: rgba(28, 32, 66, 1);
                    margin-bottom: 5px;
                    &:after{
                        content: '';
                        display: inline-block;
                        width: 24px;
                        height: 3px;
                        border-radius: 5px;
                        background-color: #586BFB;
                        position: absolute;
                        top: -3px;
                        left: 2px;
                    }
                }
                .content {
                    font-size: 1em;
                    line-height: 20px;
                    font-weight: 500;
                    color: rgba(153, 153, 153, 1);
                }
            }
            .banner {
                position: relative;
                height: 300px;
                background: url("../../static/img/mobile/banner1.png") no-repeat center /
        cover;
                .bannerContent {
                    position: absolute;
                    top: 60px;
                    left: 20px;
                    right: 20px;
                    bottom: 5px;
                    background: url("../../static/img/mobile/bannercontent.png") no-repeat center / contain
                }
                .btnBox {
                    /*position: absolute;*/
                    /* right: 0; */
                    bottom: 15px;
                    /* width: 100%; */
                    margin: 130px auto 0;
                    text-align: center;
                    max-width: 300px;
                    padding-left: 145px;
                }
            }
            .whychose {
                & > ul > li {
                    text-align: right;
                    margin-top: 30px;

                    &:nth-child(1) {
                        margin-top: 30px;
                        .img {
                            background: url("../../static/img/mobile/免费icon@2x.png") no-repeat bottom center / contain;
                        }
                    }
                    &:nth-child(2) .img {
                        background: url("../../static/img/mobile/便捷icon@2x.png") no-repeat bottom center / contain;
                    }
                    &:nth-child(3) .img {
                        background: url("../../static/img/mobile/安全icon@2x.png") no-repeat bottom center / contain;
                    }
                    .img {
                        /*float: left;*/
                        display: inline-block;
                        height: 110px;
                        width: 36%;
                        margin-left: 4%;
                    }
                    .article {
                        /*margin-left: 160px;*/
                        display: inline-block;
                        vertical-align: bottom;
                        width: 58%;
                    }
                }
                .cutt {
                    height: 118px;
                    margin-top: 40px;
                    background: url("../../static/img/mobile/tree@2x.png") no-repeat center /
          cover;
                }
            }
            .detail {
                & > ul > li {
                    height: 410px;
                    width: 80%;
                    margin: 0 auto;
                    margin-top: 60px;
                    .article {
                        /*width: 40%;*/
                        vertical-align: bottom;

                        margin-top: 0;
                        padding: 0;
                        width: 100%;
                        text-align: center;
                        .title{
                            &:after{
                                width: 40px;
                                height: 5px;
                                border-radius: 5px;
                                top: -8px;
                                left: 50%;
                                margin-left: -20px;
                            }
                        }
                    }
                }
                & > ul > li:nth-child(1) {
                    margin-top: 100px;
                    background: url("../../static/img/mobile/phone考勤签到@2x.png") no-repeat center 70px / contain;
                }
                & > ul > li:nth-child(2) {
                    background: url("../../static/img/mobile/phone考勤记录@2x.png") no-repeat center 70px / contain;
                }
                & > ul > li:nth-child(3) {
                    background: url("../../static/img/mobile/phone我的工作台@2x.png") no-repeat center 70px / contain;
                }
                & > ul > li:nth-child(4) {
                    height: 420px;
                    background: url("../../static/img/mobile/phone打卡设置@2x.png") no-repeat center 80px / contain;
                }
            }
            .download {
                position: relative;
                height: 487px;
                background: rgba(241, 244, 248, 1);
                margin-top: 50px;
                .title {
                    padding-top: 50px;
                    margin-bottom: 100px;
                    font-size: 1.5em;
                    font-family: PingFang-SC-Bold;
                    font-weight: bold;
                    color: rgba(51, 51, 51, 1);
                    text-align: center;
                }
                .downloadBtn {
                    display: block;
                    border: 1px solid rgba(1, 107, 255, 1);
                    margin: 20px auto 0;
                    width: 60%;
                    height: 46px;
                    line-height: 44px;
                    color: #333333;
                    text-align: center;
                }
                .downloadBtn.ios:before {
                    background: url("../../static/img/mobile/Apple黑@2x.png") no-repeat center / 100%;
                }
                .downloadBtn.android:before {
                    background: url("../../static/img/mobile/Android黑@2x.png") no-repeat center / 100%;
                }
                .foot {
                    padding: 10px;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    text-align: center;
                    line-height: 20px;
                    color: rgba(157, 157, 157, 0.87);
                }
            }
        }
    }

    @import "../../assets/css/common.css";
</style>