<template>
    <section class="checkdaily">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
                        <BreadcrumbItem to="">每日考勤</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table" v-loading="loading" element-loading-text="拼命加载中">
                <no-ssr>
                    <el-form class="check_table_inline" inline>
                        <div class="form_box">
                            <label class="form_title" for="">姓名：</label>
                            <el-input v-model="query_name" class="form_content" type="text"
                                      placeholder="请输入姓名" @change="onSearch"></el-input>
                        </div>
                        <div class="form_box">
                            <label class="form_title" for="">所在部门：</label>
                            <el-select class="form_department" v-model="query_department" placeholder="请选择"
                                       @change="onSearch">
                                <el-option label="全部" value="">
                                </el-option>
                                <el-option
                                        v-for="(item, index) in departments"
                                        :key="index"
                                        :label="item.depart_name"
                                        :value="item.department_id">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form_box">
                            <label class="form_title" for="">查询日期：</label>
                            <el-date-picker
                                    class="form_date"
                                    v-model="query_time_start"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd"
                                    :clearable="false"
                                    :editable="false"
                            >
                            </el-date-picker>
                            <span class="form_date_line"></span>
                            <el-date-picker
                                    class="form_date"
                                    v-model="query_time_end"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd"
                                    :clearable="false"
                                    :editable="false"
                            >
                            </el-date-picker>
                        </div>
                        <span class="form_search" @click="onSearch">查询</span>
                        <div class="export_box">
                            <span @click="exportExcel(exportStatus)" class="form_export">导出每日考勤</span>
                        </div>
                        <!-- <a class="form_export" href="http://172.26.1.198:8002/sign/dailysign_export?user_id=45d651b020b84aafacab61667638f784&date=2018-09-26">导出当日考勤</a> -->
                        <!-- <excel @exportExcel="exportExcel" title="导出当日考勤" :fileName="fileName" :filterTitle="filterTitle" :filterList="filterList"></excel>
                        <el-progress :text-inside="true" :stroke-width="10" :percentage="0"></el-progress> -->
                    </el-form>
                </no-ssr>
                <!--日期tab-->
                <no-ssr>
                    <div class="dateTap">
                        <el-tabs v-model="query_date" @tab-click="changeDateTap" :tab-position="'top'">
                            <el-tab-pane v-for="x in dateArr" :name="x" :label="x" :key="x"></el-tab-pane>
                        </el-tabs>
                    </div>
                </no-ssr>
                <div class="check_container">
                    <ul class="check_ul">
                        <li class="check_list_title">
                            <span>工号</span>
                            <span>姓名</span>
                            <span>所在部门</span>
                            <span v-if="if_lunch == 0">上班</span>
                            <span v-if="if_lunch == 0">下班</span>
                            <span v-if="if_lunch != 0">上午上班</span>
                            <span v-if="if_lunch != 0">上午下班</span>
                            <span v-if="if_lunch != 0">下午上班</span>
                            <span v-if="if_lunch != 0">下午下班</span>
                            <span class="list_outsign">请假</span>
                            <span class="list_outsign">外勤</span>
                            <span class="check_link">操作</span>
                        </li>
                        <div class="check_list_box" v-if="dailyList && dailyList.length > 0">
                            <li class="check_list" v-for="(dailyItem, index) in dailyList" :key="index">
                                <span>{{ dailyItem.employee_work_number || '无' }}</span>
                                <span :title="dailyItem.employee_name">{{ dailyItem.employee_name }}</span>
                                <span :title="(dailyItem.department === '无部门' || dailyItem.department === '无' || dailyItem.department === '') ? '未分组成员' : dailyItem.department">
                                    {{(dailyItem.department === '无部门' || dailyItem.department === '无' || dailyItem.department === '') ? '未分组成员' : dailyItem.department }}
                                </span>
                                <span v-if="if_lunch == 0" :class="{'red' : dailyItem.is_late == 2}">{{ dailyItem.checkin_time || '-' }}</span>
                                <span v-if="if_lunch == 0" :class="{'red' : dailyItem.is_early == 2}">{{ dailyItem.checkout_time || '-' }}</span>
                                <span v-if="if_lunch != 0" :class="{'red' : dailyItem.is_late == 2}">{{ dailyItem.checkin_time || '-' }}</span>
                                <span v-if="if_lunch != 0" :class="{'red' : dailyItem.is_lunch_early == 2}">{{ dailyItem.lunchin_time || '-' }}</span>
                                <span v-if="if_lunch != 0" :class="{'red' : dailyItem.is_lunch_late == 2}">{{ dailyItem.lunchout_time || '-' }}</span>
                                <span v-if="if_lunch != 0" :class="{'red' : dailyItem.is_early == 2}">{{ dailyItem.checkout_time || '-' }}</span>
                                <span class="list_outsign">
                                    <span v-for="(item, index) in dailyItem.leave_time.split('\n')" :key="index">{{ item || '-' }}</span>
                                </span>
                                <!-- <span>{{ dailyItem.outsign_time }}</span> -->
                                <span class="list_outsign">
                                    <span v-for="(item, index) in dailyItem.outsign_time.split('\n')" :key="index">{{ item || '-' }}</span>
                                </span>
                                <nuxt-link v-if="dailyItem.outsign_time !== ('无' || '')" class="check_link"
                                           :to="`./attendancelist?employee_id=${dailyItem.employee_id}&enterprise_id=${''}&employee_name=${dailyItem.employee_name}&checktime_id=${dailyItem.checktime_id}&query_time_start=${query_date}&query_time_end=${query_date}&dailyPage=true`">
                                    外勤详情
                                </nuxt-link>
                                <!--<nuxt-link v-else class="check_link"-->
                                <!--:to="`./checkattendance?employee_id=${dailyItem.employee_id}&enterprise_id=${''}&employee_name=${dailyItem.employee_name}&query_time_start=${query_date}&query_time_end=${query_date}&dailyPage=true`">-->
                                <nuxt-link v-else class="check_link" to="">-</nuxt-link>
                            </li>
                        </div>
                        <div class="check_list_box" v-else>
                            <li class="check_empty">暂无数据</li>
                        </div>
                    </ul>
                    <no-ssr>
                        <!-- <Page :total="100" :page-size="10" show-total/> -->
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
            <no-ssr>
                <el-dialog
                        title="提示"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :close-on-click-modal="false"
                >
                    <el-progress color="#0c7ff5" v-if="exportStatus" :text-inside="true" :stroke-width="18"
                                 :percentage="percentage"></el-progress>
                </el-dialog>
            </no-ssr>
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

  import {downloadAPI} from '~/utils/download'
  import icon_check from '~/static/img/workbunch/icon_check.png'

  // 方法
  import {getDays, getquerydate} from '~/plugins/gatDayArr'

  let interval = ''
  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter,
      excel
    },
    head() {
      return {
        title: '卓朗科技_每日考勤'
      }
    },
    data() {
      return {
        total: '',
        fileName: '',
        filterTitle: '',
        filterList: '',
        query_name: '',
        query_department: '',
        query_date: '',
        query_time_start: '',
        query_time_end: '',
        rownum: 14,
        pagenum: 1,
        currentPage: 1,
        dailyList: '',
        exportList: '',
        departments: '',
        loading: false,
        percentage: 0,
        exportStatus: false,
        dialogVisible: false,
        dateArr: [],
        if_lunch: 0
      }
    },
    // 初始化 每日考勤
    async asyncData ({ query, store }) {
      let userInfo = store.state.login.userInfo
      const query_time_start = getquerydate(0)
      const query_time_end = getquerydate(1)
      const query_date = (query && query.query_name) || getquerydate(1)
      let query_name = (query && query.query_name) || ''
      let query_department = (query && query.query_department) || ''
      try {
        let dailysign = await axios.get('/pcapi/sign/dailysign', {
          params: {
            // token,
            rownum: 14,
            pagenum: 1,
            query_name,
            query_department,
            query_date,
            user_id: userInfo.uid,
            enterprise_id: userInfo.enterprise_id
          }
        })
        const {data} = dailysign
        if (data.code === 0) {
          return {
            dailyList: data.data,
            departments: data.departments,
            total: data.pages,
            query_date,
            query_time_start,
            query_time_end,
            if_lunch: data.if_lunch,
            query_name,
            query_department
          }
        }
      } catch (e) {
        console.log('error', e)
      }
    },
    destroyed() {
      clearInterval(interval)
    },
    mounted() {
      // alert(this.query_date)
      this.dateArr = getDays(this.query_time_start, this.query_time_end)
    },
    methods: {
      // 导出excel
      exportExcel(exportStatus) {
        if (this.dailyList.length <= 0) {
          this.$message.info('当前无导出数据')
          return false
        }
        // this.loading = true
        const {
          query_name,
          query_department,
          query_date,
          query_time_start,
          query_time_end,
          rownum,
          pagenum
        } = this
        let query_token = Math.random()
        const userInfo = this.$store.state.login.userInfo
        if (!exportStatus) {
          // 上传进度
          let percentage = 0
          this.exportStatus = true
          this.dialogVisible = true
          const getPercent = () => {
            axios
              .get('/pcapi/sign/record_dailysign_percent', {
                params: {
                  query_token,
                  time: new Date().getTime()
                }
              })
              .then(dailysignPercent => {
                percentage = dailysignPercent.data
                this.percentage = dailysignPercent.data
                if (percentage >= 100) {
                  this.percentage = 100
                  clearInterval(interval)
                  let time = null
                  axios.get('/pcapi/sign/getfilename', {
                    params: {
                      query_token
                    }
                  }).then((filename) => {
                    time = setTimeout(() => {
                      // window.open(`http://172.27.106.5:8002/sign/export_download?filename=export/${filename.data}`, '_self')
                      location.href = `${location.protocol}//${location.host}/export/${filename.data}`
                      this.exportStatus = false
                      this.dialogVisible = false
                      this.percentage = 0
                      clearTimeout(time)
                    }, 2000)
                  })
                }
              })
          }
          getPercent()
          interval = setInterval(async () => {
            getPercent()
          }, 500)
          // 上传
          // axios.get('/pcapi/sign/dailysign_export', {
          axios.get('/pcapi/sign/dailysign_export_days', {
            params: {
              // token,
              query_name,
              query_department,
              query_date: query_time_start,
              query_date_end: query_time_end,
              user_id: userInfo.uid,
              query_token
            }
          })
          // .then(filename => {
          //   location.href = `http://dakaapp.troila.com/export/${filename.data}`
          // })
        }
      },
      // 查询
      onSearch() {
        if (!this.query_time_start || !this.query_time_end) {
          this.$message.warning('查询日期不能为空')
          return false
        }
        var day1 = new Date(this.query_time_start)
        var day2 = new Date(this.query_time_end)
        this.dateArr = getDays(this.query_time_start, this.query_time_end)
        this.query_date = this.dateArr[0]
        const dateInfo = (day2 - day1) / (1000 * 60 * 60 * 24)
        if (dateInfo > 39) {
          this.$message.warning('每次查询不能超过40天')
          return
        } else if (day1 > day2) {
          this.$message.warning('结束日期不能小于开始日期')
          return
        }
        this.pagenum = 1
        this.pulicCheck()
      },
      // 切换时间页签
      changeDateTap(tab, event) {
        // console.log(this.query_date)
        // console.log(tab, event)
        this.pulicCheck()
      },
      // 切换 page
      handleCurrentChange(val) {
        this.pagenum = val
        this.pulicCheck()
      },
      async pulicCheck() {
        const {
          query_name,
          query_department,
          query_date,
          rownum,
          pagenum
        } = this
        history.pushState({}, '', `${location.href}?query_name=${this.query_name}&query_department=${this.query_department}&query_date=${this.query_date}`)
        this.loading = true
        const userInfo = this.$store.state.login.userInfo
        let dailysign = await axios.get('/pcapi/sign/dailysign', {
          params: {
            // token,
            query_name,
            query_department,
            query_date,
            rownum,
            pagenum,
            user_id: userInfo.uid,
            enterprise_id: userInfo.enterprise_id
          }
        })
        const {data} = dailysign
        if (data.code === 0) {
          this.loading = false
          this.dailyList = data.data
          this.departments = data.departments
          this.total = data.pages
          this.if_lunch = data.if_lunch
        } else {
          this.$message.error(data.msg)
        }
      }
    }
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

    .checkdaily {
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
                padding: 25px 0 0;
                // height: 845px;
                overflow: hidden;
                box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
                border-radius: 10px;
                background-color: white;
                .check_table_inline {
                    padding: 0 20px;
                    .form_box {
                        display: inline-flex;
                        align-items: center;
                        margin-right: 20px;
                        .form_title {
                            color: #333333;
                            font-size: 13px;
                            margin-right: 10px;
                        }
                        .form_content {
                            width: auto;
                            .el-input__inner {
                                line-height: 12px;
                                font-size: 12px;
                                width: 110px;
                                height: 30px;
                                padding-left: 7px;
                                border-radius: 2px;
                                border: solid 1px #a3b8cc;
                            }
                        }
                        .form_department {
                            width: 210px;
                            height: 30px;
                            .el-input__inner {
                                width: 210px;
                                height: 30px;
                                line-height: 12px;
                                font-size: 12px;
                                border-radius: 2px;
                                padding-left: 7px;
                                border: solid 1px #a3b8cc;
                            }
                            .el-select__caret {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }
                        .form_date {
                            width: 130px !important;
                            .el-input__inner {
                                height: 30px;
                                line-height: 12px;
                                font-size: 12px;
                                border-radius: 2px;
                                border: solid 1px #a3b8cc;
                            }
                            .el-input__icon {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }
                        .form_date_line {
                            display: inline-block;
                            width: 10px;
                            height: 1px;
                            margin: 0 2px;
                            background-color: #a3b8cc;
                        }
                    }
                    .form_search {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 60px;
                        height: 28px;
                        background-color: #0c7ff5;
                        border-radius: 14px;
                        color: white;
                        font-size: 13px;
                        cursor: pointer;
                    }
                    .export_box {
                        display: inline-flex;
                        float: right;
                        flex-direction: column;
                        align-items: flex-end;
                        position: relative;
                        .form_export {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 120px;
                            height: 28px;
                            background-color: #ffffff;
                            border-radius: 14px;
                            border: solid 1px #0c7ff5;
                            color: #0c7ff5;
                            font-size: 13px;
                            margin-left: 126px;
                            float: right;
                            cursor: pointer;
                        }
                        .el-progress {
                            position: absolute;
                            top: 24px;
                            line-height: 1;
                            width: 120px;
                            float: right;
                            margin-top: 10px;
                        }
                    }
                }
                .check_container {
                    display: flex;
                    // min-height: 782px;
                    min-height: 665px;
                    width: 100%;
                    flex-direction: column;
                    justify-content: space-between;
                    .check_ul {
                        /*margin-top: 24px;*/
                        .check_list_title {
                            height: 40px;
                            display: flex;
                            align-items: center;
                            border-top: 1px solid #deeaf5;
                            border-bottom: 1px solid #deeaf5;
                            font-weight: 900;
                            font-size: 13px;
                            span {
                                display: inline-block;
                                width: 20%;
                                text-align: center;
                                color: #333333;
                            }
                            .list_outsign {
                                width: 30%;
                            }
                            .check_link {
                                width: 116px;
                                margin-right: 26px;
                            }
                        }
                        .check_list_box {
                            .check_list {
                                min-height: 40px;
                                line-height: 40px;
                                display: flex;
                                align-items: center;
                                &:nth-child(2n) {
                                    background-color: #f4f7fa;
                                }
                                span,
                                p {
                                    display: inline-block;
                                    width: 20%;
                                    text-align: center;
                                    color: #333333;
                                    &.red {
                                        color: red;
                                    }
                                }
                                .list_outsign {
                                    width: 30%;
                                    padding: 10px 0;
                                    line-height: 18px;
                                    span {
                                        width: 100%;
                                    }
                                }
                                .check_link {
                                    display: inline-block;
                                    width: 116px;
                                    text-align: center;
                                    margin-right: 26px;
                                }
                            }
                            .check_empty {
                                color: #909399;
                                font-size: 12px;
                                text-align: center;
                                margin: 20px 0;
                            }
                        }
                    }
                }
            }
            .el-dialog__wrapper {
                z-index: 10000;
                .el-dialog {
                    background: none;
                    border: none;
                    box-shadow: none;
                    margin-top: 42vh !important;
                    .el-dialog__header {
                        display: none;
                    }
                    .el-dialog__body {
                        text-align: center;
                    }
                }
            }
            .dateTap {
                height: 40px;
                margin: 20px 0 5px 0;
                border-top: 1px solid #deeaf5;
                .el-tabs__content {
                    display: none;
                }
                .el-tabs__item {
                    margin: 7px 0;
                    line-height: 30px;
                    height: 30px;
                    border-radius: 30px;
                    padding: 0 20px !important;
                }
                .el-tabs__item.is-active {
                    color: #fff;
                    background-color: #0c7ff5;
                }
                .el-tabs__active-bar {
                    display: none;
                }
                [class*=" el-icon-"], [class^=el-icon-] {
                    width: 25px;
                    height: 25px;
                    line-height: 25px;
                    border-radius: 20px;
                    background-color: #F4F7FA;
                    text-align: center;
                    margin: 0 10px;
                    vertical-align: middle;
                }
                [class*=" el-icon-"]:hover, [class^=el-icon-]:hover {
                    color: #fff;
                    background-color: #0c7ff5;
                }
                .el-tabs__nav-wrap {
                    padding: 0 20px;
                }
                .el-tabs__nav-wrap.is-scrollable {
                    padding: 0 45px;
                }
                .el-tabs__nav-wrap::after {
                    content: "";
                    display: none;
                }
            }
        }
    }
</style>
