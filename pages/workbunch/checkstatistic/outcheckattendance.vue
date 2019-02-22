<template>
    <section class="outcheckattendance">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
                        <BreadcrumbItem :to="checkstatic === '' ? '/workbunch/checkstatistic' : checkstatic"
                                        v-if="!$route.query.dailyPage">考勤统计
                        </BreadcrumbItem>
                        <BreadcrumbItem to="/workbunch/checkstatistic/checkdaily" v-if="$route.query.dailyPage">每日考勤
                        </BreadcrumbItem>
                        <BreadcrumbItem to="">查看考勤</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table" v-loading="loading" element-loading-text="拼命加载中">
                <no-ssr>
                    <el-form class="check_table_inline" inline>
                        <div class="form_box">
                            <label class="form_title" for="">姓名：</label>
                            <el-input v-model="query_name" class="form_content" type="text" placeholder="请输入姓名"
                                      disabled></el-input>
                        </div>
                        <div class="form_box">
                            <label class="form_title" for="">查询日期：</label>
                            <el-date-picker
                                    class="form_date"
                                    v-model="query_date_start"
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
                                    v-model="query_date_end"
                                    type="date"
                                    placeholder="选择日期"
                                    value-format="yyyy-MM-dd"
                                    :clearable="false"
                                    :editable="false"
                            >
                            </el-date-picker>
                        </div>
                        <span class="form_search" @click="onSearch">查询</span>
                        <!-- <span class="form_export">导出当日考勤</span> -->
                        <div class="export_box">
                            <span @click="exportExcel(exportStatus)" class="form_export">导出考勤</span>
                        </div>
                    </el-form>
                </no-ssr>
                <div class="check_container">
                    <ul class="check_ul">
                        <li class="check_record" v-if="others.name !== ''">已为您查询到 <span>{{ others.name }} ，{{ others.start_date }}</span>
                            至 <span>{{ others.end_date }}</span> 的考勤记录。
                        </li>
                        <li class="check_list_title">
                            <span>日期</span>
                            <span v-if="if_lunch == 0">上班</span>
                            <span v-if="if_lunch == 0">下班</span>
                            <span v-if="if_lunch != 0">上午上班</span>
                            <span v-if="if_lunch != 0">上午下班</span>
                            <span v-if="if_lunch != 0">下午上班</span>
                            <span v-if="if_lunch != 0">下午下班</span>
                            <span>外勤</span>
                            <span>操作</span>
                        </li>
                        <div class="check_list_box" v-if="dailyList && dailyList.length > 0">
                            <li class="check_list" v-for="(dailyItem, index) in dailyList" :key="index">
                                <span>{{ dailyItem.date }}</span>
                                <span v-if="if_lunch == 0">{{ dailyItem.checkin_time || '-' }}</span>
                                <span v-if="if_lunch == 0">{{ dailyItem.checkout_time || '-' }}</span>
                                <span v-if="if_lunch != 0">{{ dailyItem.checkin_time || '-' }}</span>
                                <span v-if="if_lunch != 0">{{ dailyItem.lunchin_time || '-' }}</span>
                                <span v-if="if_lunch != 0">{{ dailyItem.lunchout_time || '-' }}</span>
                                <span v-if="if_lunch != 0">{{ dailyItem.checkout_time || '-' }}</span>
                                <span>{{ dailyItem.outsign_time }}</span>
                                <nuxt-link v-if="dailyItem.outsign_time && dailyItem.outsign_time !== '-'"
                                           class="check_link"
                                           :to="`./attendancelist?employee_id=${employee_id}&query_name=${query_name}&date=${dailyItem.date}&checktime_id=${dailyItem.checktime_id}`">
                                    查看
                                </nuxt-link>
                                <span v-else>-</span>
                            </li>
                        </div>
                        <div class="check_list_box" v-else>
                            <li class="check_empty">暂无数据</li>
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

  import {getDays, getquerydate} from '~/plugins/gatDayArr'

  // 文件

  import icon_check from '~/static/img/workbunch/icon_check.png'

  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter,
      excel
    },
    head() {
      return {
        title: '卓朗科技_考勤统计_查看统计'
      }
    },
    data() {
      return {
        total: '',
        date: '',
        fileName: '',
        filterTitle: '',
        filterList: '',
        query_name: '',
        query_date_start: '',
        query_date_end: '',
        rownum: 14,
        pagenum: 1,
        currentPage: 1,
        employee_id: '',
        dailyList: '',
        loading: false,
        others: '',
        exportStatus: false,
        dialogVisible: false,
        percentage: 0,
        checkstatic: '',
        if_lunch: 0,
      }
    },
    // 初始化 外勤考勤

    async asyncData({query, route, store}) {
      const employee_id = query.employee_id
      const enterprise_id = query.enterprise_id
      const employee_name = query.employee_name
      const checktime_id = query.checktime_id
      let userInfo = store.state.login.userInfo
      const query_date_start = query.query_time_start || getquerydate(0)
      const query_date_end = query.query_time_end || getquerydate(1)

      try {
        let dailysign = await axios.get('/pcapi/sign/signquery', {
          params: {
            // token,
            rownum: 14,
            pagenum: 1,
            employee_id,
            query_checktime: checktime_id,
            user_id: userInfo.uid,
            enterprise_id: userInfo.enterprise_id,
            query_date_start,
            query_date_end
          }
        })
        const {data} = dailysign
        if (data.code === 0) {
          return {
            dailyList: data.data,
            departments: data.departments,
            total: data.pages,
            employee_id,
            enterprise_id,
            others: data.others,
            query_date_start,
            query_date_end,
            query_name: employee_name,
            if_lunch: data.if_lunch
          }
        }
      } catch (e) {
        console.log('error', e)
      }
    },
    mounted() {
      sessionStorage.setItem('signlist', this.$route.fullPath)
      sessionStorage.setItem('outsignlist', this.$route.fullPath)

      const checkstatic = sessionStorage.getItem('checkstatic')
      this.checkstatic = `${checkstatic.split('?')[0]}?${
        this.$route.fullPath.split('?')[1]
        }`
      sessionStorage.setItem('checkstatic', this.checkstatic)
    },
    methods: {
      // 导出查看考勤excel
      exportExcel(exportStatus) {
        if (this.dailyList.length <= 0) {
          this.$message.info('当前无导出数据')
          return false
        }
        const {
          query_name,
          query_date_start,
          query_date_end,
          rownum,
          pagenum,
          employee_id
        } = this
        let query_token = Math.random()
        const userInfo = this.$store.state.login.userInfo
        if (!exportStatus) {
          axios
            .get('/pcapi/sign/signquery_export', {
              params: {
                // token,
                query_name,
                query_date_start,
                query_date_end,
                employee_id,
                user_id: userInfo.uid,
                query_token
              }
            })
            .then(filename => {
              let percentage = 0
              this.exportStatus = true
              this.dialogVisible = true
              let interval = setInterval(() => {
                axios
                  .get('/pcapi/sign/record_signquery_percent', {
                    params: {
                      query_token,
                      time: new Date().getTime()
                    }
                  })
                  .then(dailysignPercent => {
                    percentage = dailysignPercent.data
                    this.percentage = dailysignPercent.data
                    if (percentage === 100) {
                      clearInterval(interval)
                      let time = setTimeout(() => {
                        // window.open(`http://172.27.106.5:8002/sign/export_download?filename=export/${filename.data}`, '_self')
                        location.href = `${location.protocol}//${location.host}/export/${filename.data}`
                        this.exportStatus = false
                        this.dialogVisible = false
                        this.percentage = 0
                        clearTimeout(time)
                      }, 2000)
                    }
                  })
              }, 500)
            })
        }
      },
      // 查询
      onSearch() {
        if (!this.query_date_start || !this.query_date_end) {
          this.$message.warning('查询日期不能为空')
          return false
        }
        var day1 = new Date(this.query_date_start)
        var day2 = new Date(this.query_date_end)
        this.dateArr = getDays(this.query_date_start, this.query_date_end)
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
      // 切换 page
      handleCurrentChange(val) {
        this.pagenum = val
        this.pulicCheck()
      },
      // public 查询
      async pulicCheck() {
        const {
          query_name,
          query_date_start,
          query_date_end,
          checktime_id,
          rownum,
          pagenum,
          employee_id
        } = this
        this.loading = true
        const userInfo = this.$store.state.login.userInfo
        let dailysign = await axios.get('/pcapi/sign/signquery', {
          params: {
            // token,
            query_name,
            query_date_start,
            query_date_end,
            query_checktime: checktime_id,
            rownum,
            pagenum,
            employee_id,
            user_id: userInfo.uid,
            enterprise_id: userInfo.enterprise_id
          }
        })
        const {data} = dailysign
        if (data.code === 0) {
          this.loading = false
          this.dailyList = data.data
          this.dailyList = data.data
          this.departments = data.departments
          this.total = data.pages
          this.if_lunch = data.if_lunch
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

    .outcheckattendance {
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
                }
                .check_container {
                    display: flex;
                    height: 690px;
                    flex-direction: column;
                    justify-content: space-between;
                    .check_ul {
                        margin-top: 24px;
                        .check_record {
                            height: 40px;
                            display: flex;
                            align-items: center;
                            font-size: 13px;
                            border-top: 1px solid #eeeeee;
                            padding: 0 20px;
                            span {
                                color: #0c7ff5;
                            }
                        }
                        .check_list_title {
                            height: 40px;
                            display: flex;
                            align-items: center;
                            border-top: 1px solid #deeaf5;
                            border-bottom: 1px solid #deeaf5;
                            padding: 0 116px;
                            span {
                                display: inline-block;
                                width: 20%;
                                text-align: center;
                                display: inline-block;
                            }
                        }
                        .check_list_box {
                            .check_list {
                                min-height: 40px;
                                line-height: 40px;
                                display: flex;
                                align-items: center;
                                padding: 0 116px;
                                &:nth-child(2n) {
                                    background-color: #f4f7fa;
                                }
                                span {
                                    display: inline-block;
                                    width: 20%;
                                    text-align: center;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    display: inline-block;
                                }
                                .check_link {
                                    display: inline-block;
                                    width: 20%;
                                    text-align: center;
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
                    // 分页
                    .ivu-page {
                        margin-top: 26px;
                        text-align: center;
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
        }
    }
</style>
