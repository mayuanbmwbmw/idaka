<template>
  <section class="attendancelist">
    <navbar></navbar>
      <div class="check_main">
        <div class="breadcrumb">
          <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
          <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
          <no-ssr>
            <Breadcrumb separator=">">
              <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
              <BreadcrumbItem :to="checkstatic === '' ? '/workbunch/checkstatistic' : checkstatic" v-if="!$route.query.dailyPage">考勤统计</BreadcrumbItem>
              <BreadcrumbItem to="/workbunch/checkstatistic/checkdaily" v-if="$route.query.dailyPage">每日考勤</BreadcrumbItem>
              <BreadcrumbItem :to="signlist === '' ? './outcheckattendance': signlist" v-if="!$route.query.dailyPage">查看考勤</BreadcrumbItem>
              <BreadcrumbItem to="">查看外勤</BreadcrumbItem>
            </Breadcrumb>
          </no-ssr>
        </div>
        <div class="check_table">
          <div class="check_user">
            <p class="user_name">{{ query_name }}</p>
            <p class="user_time">{{ date }}</p>
          </div>
          <div class="check_container">
            <ul class="check_ul">
              <li class="check_list_title">
                <span>活动名称</span>
                <span>活动内容</span>
                <span>地址</span>
                <span>时间</span>
                <span>操作</span>
              </li>
              <div class="check_list_box" v-if="dailyList && dailyList.length > 0">
                <li class="check_list" v-for="(dailyItem, index) in dailyList" :key="index">
                  <span :title="dailyItem.activity_name || '外勤打卡'">{{ dailyItem.activity_name || '外勤打卡'}}</span>
                  <span :title="dailyItem.activity_info || '无'">{{ dailyItem.activity_info || '无'}}</span>
                  <span :title="dailyItem.place">{{ dailyItem.place}}</span>
                  <span :title="dailyItem.outsign_time">{{ dailyItem.outsign_time}}</span>
                  <nuxt-link v-if="!$route.query.dailyPage" class="check_link" :to="`./attendancedetail?outsign_id=${dailyItem.outsign_id}&query_name=${query_name}`">查看</nuxt-link>
                  <nuxt-link v-if="$route.query.dailyPage" class="check_link" :to="`./attendancedetail?outsign_id=${dailyItem.outsign_id}&query_name=${query_name}&dailyPage=true`">查看</nuxt-link>
                </li>
              </div>
              <div class="check_list_box" v-else>
                <li class="check_list">
                  <span>外勤打卡</span>
                  <span>无</span>
                  <span>无</span>
                  <span>无</span>
                  <span class="check_link">-</span>
                </li>
              </div>
            </ul>
            <no-ssr>
              <el-pagination
                v-if="parseInt(total) > 0"
                @current-change="handleCurrentChange"
                :current-page.sync="pagenum"
                :page-size="16"
                layout="total, prev, pager, next"
                :page-count="parseInt(total)">
              </el-pagination>
            </no-ssr>
          </div>
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
import excel from '~/components/common/excel'

// 文件

import icon_check from '~/static/img/workbunch/icon_check.png'

export default {
  middleware: 'check-login',
  components: {
    navbar,
    trfooter,
    excel
  },
  head () {
    return {
      title: '卓朗科技_考勤统计_查看考勤_查看外勤'
    }
  },
  data () {
    return {
      total: '',
      date: '',
      fileName: '',
      filterTitle: '',
      filterList: '',
      query_name: '',
      query_time_start: '',
      query_time_end: '',
      rownum: 14,
      pagenum: 1,
      currentPage: 1,
      employee_id: '',
      dailyList: '',
      signlist: '',
      checkstatic: '',
      // query_name: '',
      // date: ''
    }
  },
  // 初始化 查看外勤
  async asyncData ({ query, store }) {
    const employee_id = query.employee_id
    const query_name = query.query_name || query.employee_name
    const date = query.date
    const checktime_id = query.checktime_id
    let userInfo = store.state.login.userInfo
    try {
      let dailysign = await axios.get('/pcapi/sign/outsignquery', {
        params: {
          // token,
          rownum: 14,
          pagenum: 1,
          employee_id,
          user_id: userInfo.uid,
          enterprise_id: userInfo.enterprise_id,
          query_checktime: checktime_id
        }
      })
      const { data } = dailysign
      if (data.code === 0) {
        return {
          dailyList: data.data,
          total: data.pages,
          employee_id,
          query_name,
          date
        }
      }
    } catch (e) {
      console.log('error', e)
    }
  },
  mounted () {
    this.signlist = sessionStorage.getItem('signlist')
    this.checkstatic = sessionStorage.getItem('checkstatic')

    // sessionStorage.setItem('signlist', this.$route.fullPath)
    sessionStorage.setItem('outsignlist', this.$route.fullPath)
  },
  methods: {
    // 查询
    onSearch () {
      this.pagenum = 1
      this.pulicCheck()
    },
    // 切换 page
    handleCurrentChange (val) {
      this.pagenum = val
      this.pulicCheck()
    },
    // public 查询
    async pulicCheck () {
      const {
        employee_id,
        rownum,
        pagenum,
        checktime_id
      } = this
      let outsignquery = await axios.get('/pcapi/sign/outsignquery', {
        params: {
          // token,
          employee_id,
          rownum,
          pagenum,
          query_checktime: checktime_id
        }
      })
      const { data } = outsignquery
      this.dailyList = data.data
      this.total = data.pages
    }
  },

}
</script>
<style lang="scss">
.ivu-breadcrumb a {
  color: #999999;
}
.ivu-select-selection {
  border-radius: 2px;
  border: solid 1px #a3b8cc;
}
.attendancelist {
  margin-top: 84px;
  background-color: #f1f4f8;
  .check_main {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 18px;
    .breadcrumb {
      margin: 0px 0 10px;
      .breadcrumb_item {
        color: #999999;
        font-size: 12px;
      }
    }
    .check_table {
      padding: 34px 0 0;
      // height: 845px;
      overflow: hidden;
      box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
      border-radius: 10px;
      background-color: white;
      .check_user {
        padding-left: 42px;
        padding-bottom: 22px;
        .user_name {
          color: #333333;
          font-size: 18px;
        }
        .user_time {
          color: #999999;
          font-size: 14px;
        }
      }
      .check_container {
        display: flex;
        height: 690px;
        flex-direction: column;
        justify-content: space-between;
        .check_ul {
          .check_list_title {
            height: 40px;
            display: flex;
            align-items: center;
            border-top: 1px solid #deeaf5;
            border-bottom: 1px solid #deeaf5;
            span {
              display: inline-block;
              width: 20%;
              text-align: center;
              display: inline-block;
              &:last-child {
                margin-right: 26px;
              }
            }
          }
          .check_list_box {
            .check_list {
              min-height: 40px;line-height: 40px;
              display: flex;
              align-items: center;
              &:nth-child(2n) {
                background-color: #f4f7fa;
              }
              span {
                display: inline-block;
                width: 25%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: inline-block;
              }
              .check_link {
                display: inline-block;
                width: 25%;
                text-align: center;
                margin-right: 26px;
              }
            }
            .check_empty{
              color: #909399;
              font-size: 12px;
              text-align: center;
              margin: 20px 0;
            }
          }
        }
        // 分页
        .ivu-page {
          margin-top: 26px;
          text-align: center;
        }
      }
    }
  }
}
</style>