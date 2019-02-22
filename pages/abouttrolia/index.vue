<template>
  <section class="abouttrolia">
    <navbar></navbar>
    <div class="fixBox">
      <!--<div class="module contact">咨询/反馈</div>-->
      <div class="module totop" @click="totop">返回顶部</div>
    </div>
    <div class="abouttrolia_box">
      <div class="abouttrolia_banner"></div>
      <div class="abouttrolia_contact">
        <p class="abouttrolia_title">天津卓朗科技发展有限公司成立于2009年，是天津市成长发展的大学生创业企业。卓朗科技是国家高新技术企业，是天津市首批科技小巨人企业，双软认证企业。公司注册资本1.75亿元，坐落于红桥区湘潭道1号，公司占地2万平方米，建有数据中心2.5万平方米。</p>
        <p class="abouttrolia_title">“卓越做事，爽朗做人”是卓朗的企业文化基调，卓朗人始终以数据创造价值，不断为用户创造卓越的IT系统。400多个年轻卓朗人正在用青春和梦想打造一支“云计算”服务国家队，用创新和汗水推动中国“云计算”软件与服务的进步。</p>
        <ul class="abouttrolia_ul">
          <li class="abouttrolia_list">
            <img :src="icon_mail" alt="" class="icon_mail">
            <div class="list_company">
              <span class="company_title">公司邮箱</span>
              <span class="company_content">dakakf@troila.com</span>
            </div>
          </li>
          <li class="abouttrolia_list">
            <img :src="icon_phone" alt="" class="icon_phone">
            <div class="list_company">
              <span class="company_title">公司电话</span>
              <span class="company_content">022-58301543</span>
            </div>
          </li>
          <li class="abouttrolia_list">
            <img :src="icon_qq" alt="" class="icon_qq">
            <div class="list_company">
              <span class="company_title">QQ群</span>
              <span class="company_content">282191327</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
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
import icon_qq from '~/static/img/abouttrolia/icon_qq.png'
import icon_phone from '~/static/img/abouttrolia/icon_phone.png'
import icon_mail from '~/static/img/abouttrolia/icon_mail.png'

export default {
  components: {
    navbar,
    trfooter
  },
  head() {
    return {
      title: '卓朗科技_关于我们'
    }
  },
  data() {
    return {
      icon_qq,
      icon_phone,
      icon_mail
    }
  },
  
  async asyncData ({ }) {
    try {
      return {
      }
    } catch (e) {
      // console.log('error', e)
    }
    
  },
  methods: {
    totop () {
      window.scrollTo(0, 0);
    },
  }
}
</script>
<style lang="scss" scoped>
.abouttrolia {
  .fixBox {
    position: fixed;
    top: 41%;
    right: 2%;
    z-index: 2;
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
  .abouttrolia_box{
    background-color: #f1f4f8;
    padding-bottom: 70px;
    margin-top: 66px;
    .abouttrolia_banner{
      width: 100%;
      height: 480px;
      background: url(~/static/img/abouttrolia/abouttrolia_bannerbg.png) no-repeat 50%;
      // background-size: 100% 100%;
    }
    .abouttrolia_contact{
      width: 1200px;
      height: 410px;
      overflow: hidden;
      background-color: #ffffff;
      box-shadow: 0px 2px 10px 0px 
        rgba(0, 24, 148, 0.3);
      border-radius: 10px;
      margin: -26px auto 0;
      .abouttrolia_title{
        color: #333333;
        font-size: 13px;
        line-height: 24px;
        text-indent: 26px;
        width: 840px;
        margin: 0 auto;
        &:first-child{
          margin-top: 60px;
          margin-bottom: 18px;
        }
      }
      .abouttrolia_ul{
        width: 848px;
        margin: 0 auto;
        margin-top: 100px;
        display: flex;
        justify-content: space-between;
        .abouttrolia_list{
          display: flex;
          align-items: center;
          &:nth-child(2){
            padding: 0 102px;
            border-left: 1px solid #c1dbff;
            border-right: 1px solid #c1dbff;
          }
          .icon_mail{
            width: 36px;
            height: 25px;
          }
          .icon_phone{
            width: 33px;
            height: 35px;
          }
          .icon_qq{
            width: 30px;
            height: 32px;
          }
          .list_company{
            display: flex;
            flex-direction: column;
            margin-left: 4px;
            .company_title{
              color: #333333;
              font-size: 13px;
            }
            .company_content{
              color: #333333;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}
</style>