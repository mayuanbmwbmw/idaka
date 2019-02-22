<template>
    <section class="workbunch">
        <navbar></navbar>
        <div class="fixBox">
            <!--<div class="module contact">咨询/反馈</div>-->
            <div class="module totop" @click="totop">返回顶部</div>
        </div>
        <div class="workbunch_banner"></div>
        <div class="workbunch_main">
            <ul class="workbunch_ul" v-if="uid && permissions > 0">
                <li class="workbunch_list big" v-if="(CHECK_TOTAL_READ & permissions) === CHECK_TOTAL_READ">
                    <div class="workbunch_link">
                        <img :src="icon_check" alt="" class="list_icon">
                        <div class="list_r">
                            <p class="list_title">考勤统计</p>
                        </div>
                    </div>
                    <div>
                        <nuxt-link class="link" :to="`/workbunch/checkstatistic/checkdaily`">每日考勤</nuxt-link>
                        <nuxt-link class="link" :to="`/workbunch/checkstatistic`">考勤统计</nuxt-link>
                    </div>
                </li>
                <li class="workbunch_list big" v-if="(EMPLOYEE_READ & permissions) === EMPLOYEE_READ">
                    <div class="workbunch_link">
                        <img :src="icon_staff" alt="" class="list_icon">
                        <div class="list_r">
                            <p class="list_title">员工管理</p>
                        </div>
                    </div>
                    <div>
                        <nuxt-link class="link" :to="`/workbunch/empmanagement`">员工审核</nuxt-link>
                        <nuxt-link class="link" :to="`/workbunch/empmanagement/department`">部门管理</nuxt-link>
                    </div>
                </li>
                <!--<li class="workbunch_list" v-if="(CHECK_TOTAL_READ & permissions) === CHECK_TOTAL_READ">-->
                <!--<nuxt-link class="workbunch_link" :to="`/workbunch/checkstatistic`">-->
                <!--<img :src="icon_check" alt="" class="list_icon">-->
                <!--<div class="list_r">-->
                <!--<p class="list_title">考勤统计</p>-->
                <!--<p class="list_subtitle">查看公司全部员工的考勤记录</p>-->
                <!--</div>-->
                <!--</nuxt-link>-->
                <!--</li>-->
                <!--<li class="workbunch_list" v-if="(EMPLOYEE_READ & permissions) === EMPLOYEE_READ">-->
                <!--<nuxt-link class="workbunch_link" :to="`/workbunch/empmanagement/department`">-->
                <!--<img :src="icon_staff" alt="" class="list_icon">-->
                <!--<div class="list_r">-->
                <!--<p class="list_title">员工管理</p>-->
                <!--<p class="list_subtitle">公司的组织架构全面呈现</p>-->
                <!--</div>-->
                <!--</nuxt-link>-->
                <!--</li>-->
                <li class="workbunch_list" v-if="(ENTERPRISE_MANAGER & permissions) === ENTERPRISE_MANAGER">
                    <nuxt-link class="workbunch_link" :to="`/workbunch/busmanagement`">
                        <img :src="icon_enterprise" alt="" class="list_icon">
                        <div class="list_r" :style="{marginTop: '8px'}">
                            <p class="list_title">企业管理</p>
                            <p class="list_subtitle">查看修改与注销企业信息</p>
                        </div>
                    </nuxt-link>
                </li>
                <li class="workbunch_list" v-if="(NOTIFICATION & permissions) === NOTIFICATION">
                    <nuxt-link class="workbunch_link" :to="`/workbunch/notification`">
                        <img :src="icon_release" alt="" class="list_icon">
                        <div class="list_r">
                            <p class="list_title">发布通知</p>
                            <p class="list_subtitle">可以为全体员工推送消息</p>
                        </div>
                    </nuxt-link>
                </li>
                <!--<li class="workbunch_list">-->
                    <!--<nuxt-link class="workbunch_link" :to="`/workbunch/cardsetting`">-->
                        <!--<img :src="icon_punch" alt="" class="list_icon">-->
                        <!--<div class="list_r" :style="{marginTop: '16px'}">-->
                            <!--<p class="list_title">打卡设置</p>-->
                            <!--<p class="list_subtitle">一键设置上下班时间和公司位置</p>-->
                        <!--</div>-->
                    <!--</nuxt-link>-->
                <!--</li>-->
                <li class="workbunch_list" v-if="(AUTHORITY & permissions) === AUTHORITY">
                    <nuxt-link class="workbunch_link" :to="`/workbunch/authority`">
                        <img :src="icon_power" alt="" class="list_icon">
                        <div class="list_r" :style="{marginTop: '22px'}">
                            <p class="list_title">权限控制</p>
                            <p class="list_subtitle">为员工添加或修改管理权限</p>
                        </div>
                    </nuxt-link>
                </li>
            </ul>
        </div>
        <trfooter></trfooter>
    </section>
</template>
<script>
  // 插件
  import axios from "~/plugins/axios";

  // 组件
  import navbar from "~/components/common/navbar";
  import trfooter from "~/components/common/trfooter";

  // 文件
  import { EMPLOYEE_READ, ENTERPRISE_MANAGER, CHECK_TOTAL_READ, NOTIFICATION, AUTHORITY } from '~/utils/authority'

  import icon_check from "~/static/img/workbunch/icon_check.png";
  import icon_enterprise from "~/static/img/workbunch/icon_enterprise.png";
  import icon_power from "~/static/img/workbunch/icon_power.png";
  import icon_punch from "~/static/img/workbunch/icon_punch.png";
  import icon_release from "~/static/img/workbunch/icon_release.png";
  import icon_staff from "~/static/img/workbunch/icon_staff.png";

  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter
    },
    head() {
      return {
        title: "卓朗科技_打卡助手"
      };
    },
    data() {
      return {
        icon_check,
        icon_enterprise,
        icon_power,
        icon_punch,
        icon_release,
        icon_staff,
        uid: null,
        EMPLOYEE_READ,
        ENTERPRISE_MANAGER,
        CHECK_TOTAL_READ,
        NOTIFICATION,
        AUTHORITY,
      };
    },

    async asyncData({ store }) {
      let userInfo = store.state.login.userInfo
      let permissions = userInfo ? userInfo.permissions : 0
      let uid = userInfo ? userInfo.uid : null
      try {
        return {
          permissions,
          uid
        };
      } catch (e) {
        // console.log('error', e)
      }
    },
    mounted() {
      console.log(this.permissions)
    },
    methods: {
      totop () {
        window.scrollTo(0, 0);
      },
    }
  };
</script>
<style lang="scss" scoped>
    .workbunch {
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
        .workbunch_banner {
            width: 100%;
            height: 280px;
            margin-top: 66px;
            background: url(~/static/img/workbunch/workbunch_banner.png) no-repeat
            center 50%;
        }
        .workbunch_main {
            background-color: white;
            .workbunch_ul {
                width: 1200px;
                margin: 118px auto 150px;
                display: flex;
                flex-wrap: wrap;
                .workbunch_list {
                    flex: 2;
                    /*width: 25%;*/
                    display: flex;
                    margin-bottom: 94px;
                    align-items: center;
                    &.big{
                        flex: 3;
                        /*width: 48%;*/
                        margin-right: 2%;
                        height: 180px;
                        box-shadow: 0 0 38px -2px #DAE4EA;
                        border-radius: 15px;
                        margin-bottom: 70px;
                        &:hover{
                            box-shadow: 0 0 38px 5px #DAE4EA;
                        }
                        .workbunch_link{
                            padding-left: 35px;
                            padding-right: 30px;
                            border-right: 1px solid #ccc;
                        }
                        .link{
                            display: block;
                            width: 330px;
                            text-align: center;
                            font-size: 17px;
                            line-height: 60px;
                            color: inherit;
                            &:hover{
                                color: #09f;
                            }
                        }
                    }
                    .workbunch_link {
                        display: flex;
                        align-items: center;

                        .list_icon {
                            width: 77px;
                            margin-right: 6px;
                        }
                        .list_r {
                            margin-top: 12px;
                            .list_title {
                                color: #333333;
                                font-size: 20px;
                                line-height: 18px;
                                margin-bottom: 11px;
                                font-weight: 900;
                            }
                            .list_subtitle {
                                color: #999999;
                                font-size: 14px;
                                width: 102px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>