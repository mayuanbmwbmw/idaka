<template>
    <section class="checkstatistic">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
                        <BreadcrumbItem to="">考勤统计</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table" v-loading="loading" element-loading-text="拼命加载中">
                <no-ssr>
                    <el-form class="check_table_inline" :model="formItem" inline>
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
                        <!-- <span class="form_export">导出考勤</span> -->
                        <div class="export_box">
                            <el-tooltip class="item" effect="dark" content="需要office2013或更高版本" placement="bottom">
                                <span @click="exportExcel(exportStatus)" class="form_export">导出考勤</span>
                            </el-tooltip>
                            <span @click="exportExcel(exportStatus, 'old')" class="form_export">导出旧版考勤</span>
                        </div>
                        <!-- <excel @exportExcel="exportExcel" title="导出考勤" :fileName="fileName" :filterTitle="filterTitle" :filterList="filterList"></excel> -->
                    </el-form>
                </no-ssr>
                <div class="check_container">
                    <ul class="check_ul">
                        <li class="check_list_title">
                            <span class="check_list_item">工号</span>
                            <span class="check_list_item">姓名</span>
                            <span class="check_list_item">所在部门</span>

                            <span class="check_list_item">出勤（天）</span>
                            <span class="check_list_item">旷工（天）</span>
                            <span class="check_list_item">请假（天）</span>
                            <span class="check_list_item">加班（小时）</span>

                            <span class="check_list_item">迟到（次）</span>
                            <span class="check_list_item">早退（次）</span>
                            <span class="check_list_item">缺卡（次）</span>
                            <span class="check_list_item">外勤（次）</span>

                            <span class="check_list_item">操作</span>
                        </li>
                        <div class="check_list_box" v-if="dailyList && dailyList.length > 0">
                            <li class="check_list" v-for="(dailyItem, index) in dailyList" :key="index">
                                <span>{{ dailyItem.employee_work_number || '无' }}</span>
                                <span :title="dailyItem.employee_name">{{ dailyItem.employee_name }}</span>
                                <span :title="dailyItem.department === '暂无部门' ? '未分组成员' : dailyItem.department">{{ dailyItem.department === '暂无部门' ? '未分组成员' : dailyItem.department}}</span>

                                <span>{{ dailyItem.chuqin }}</span>
                                <span>{{ dailyItem.kuanggong }}</span>
                                <span>{{ dailyItem.vacation }}</span>
                                <span>{{ dailyItem.jiaban }}</span>

                                <span>{{ dailyItem.toolate }}</span>
                                <span>{{ dailyItem.tooearly }}</span>
                                <span>{{ dailyItem.queka }}</span>
                                <span>{{ dailyItem.outsign }}</span>

                                <nuxt-link v-if="dailyItem.outsign > 0" class="check_link"
                                           :to="`./checkstatistic/outcheckattendance?employee_id=${dailyItem.employee_id}&enterprise_id=${dailyItem.enterprise_id}&employee_name=${dailyItem.employee_name}&checktime_id=${dailyItem.checktime_id}&query_time_start=${query_time_start}&query_time_end=${query_time_end}`">
                                    查看
                                </nuxt-link>
                                <nuxt-link v-else class="check_link"
                                           :to="`./checkstatistic/checkattendance?employee_id=${dailyItem.employee_id}&enterprise_id=${dailyItem.enterprise_id}&employee_name=${dailyItem.employee_name}&checktime_id=${dailyItem.checktime_id}&query_time_start=${query_time_start}&query_time_end=${query_time_end}`">
                                    查看
                                </nuxt-link>
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
  // import {
  //   Form,
  //   Select,
  //   Option,
  //   DatePicker
  // } from "element-ui";
  import navbar from '~/components/common/navbar'
  import trfooter from '~/components/common/trfooter'
  import excel from '~/components/common/excel'

  import {getquerydate} from '~/plugins/gatDayArr'

  // 文件
  import icon_check from '~/static/img/workbunch/icon_check.png'

  let interval = ''
  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter,
      excel
    },
    head () {
      return {
        title: '卓朗科技_考勤统计'
      }
    },
    data () {
      return {
        formItem: {
          input: ''
        },
        total: '',
        value1: '',
        fileName: '',
        filterTitle: '',
        filterList: '',
        query_name: '',
        query_department: '',
        query_time_start: '',
        query_time_end: '',
        rownum: 14,
        pagenum: 1,
        currentPage: 1,
        dailyList: '',
        departments: '',
        loading: true,
        percentage: 0,
        exportStatus: false,
        dialogVisible: false,
        dailysignInfo: null
      }
    },
    // 初始化 考勤统计
    // async asyncData({ store }) {
    //   let userInfo = store.state.login.userInfo;
    //   var myDate = new Date();
    //   const fullYear = myDate.getFullYear();
    //   const month = myDate.getMonth();
    //   const date = myDate.getDate();
    //   const query_time_start = `${fullYear}-${month}-${date}`;
    //   const query_time_end = `${fullYear}-${month + 1}-${date}`;
    //   try {
    //     let dailysign = await axios.get("/pcapi/sign/signcount", {
    //       params: {
    //         // token,
    //         rownum: 14,
    //         pagenum: 1,
    //         query_time_start,
    //         query_time_end,
    //         user_id: userInfo.uid,
    //         enterprise_id: userInfo.enterprise_id
    //       }
    //     });
    //     const { data } = dailysign;
    //     if (data.code === 0) {
    //       return {
    //         dailyList: data.data,
    //         departments: data.departments,
    //         total: data.pages,
    //         query_time_start,
    //         query_time_end,
    //         loading: false
    //       };
    //     }
    //   } catch (e) {
    //     console.log("error", e);
    //   }
    // },
    async mounted () {
      let userInfo = this.$store.state.login.userInfo
      // var myDate = new Date()
      // const fullYear = myDate.getFullYear()
      // const month = myDate.getMonth()
      // const date = myDate.getDate()
      // var months = parseInt(month, 10);
      // const lastdate = new Date(fullYear, months, 0).getDate();
      let query_name = this.query_name = (this.$route.query && (this.$route.query.query_name || this.$route.query.employee_name)) || ''
      let query_department = this.query_department = (this.$route.query && this.$route.query.query_department) || ''
      let query_time_start = this.query_time_start = (this.$route.query && this.$route.query.query_time_start) || getquerydate(0)
      let query_time_end = this.query_time_end = (this.$route.query && this.$route.query.query_time_end) || getquerydate(1)
      // console.log(getquerydate(0),getquerydate(1))
      let dailysign = await
      axios.get('/pcapi/sign/signcount', {
        params: {
          // token,
          rownum: 14,
          pagenum: 1,
          query_name,
          query_department,
          query_time_start,
          query_time_end,
          user_id: userInfo.uid,
          enterprise_id: userInfo.enterprise_id
        }
      })
      const {data} = dailysign
      if (data.code === 0) {
        this.dailyList = data.data
        this.departments = data.departments
        this.total = data.pages
        this.loading = false
      }
      sessionStorage.setItem('checkstatic', this.$route.fullPath)
    },
    destroyed () {
      clearInterval(interval)
    },
    methods: {
      // 判断浏览器类型
      // getBrowser () {
      //   var ua = window.navigator.userAgent
      //   var isIE = window.ActiveXObject != undefined && ua.indexOf('MSIE') != -1
      //   var isFirefox = ua.indexOf('Firefox') != -1
      //   var isOpera = window.opr != undefined
      //   var isChrome = ua.indexOf('Chrome') && window.chrome
      //   var isSafari = ua.indexOf('Safari') != -1 && ua.indexOf('Version') != -1
      //   if (isIE) {
      //     return 'IE'
      //   } else if (isFirefox) {
      //     return 'Firefox'
      //   } else if (isOpera) {
      //     return 'Opera'
      //   } else if (isChrome) {
      //     return 'Chrome'
      //   } else if (isSafari) {
      //     return 'Safari'
      //   } else {
      //     return 'Unkown'
      //   }
      // },

      // 导出考勤
      exportExcel (exportStatus, mode) {
        if (this.dailyList.length <= 0) {
          this.$message.info('当前无导出数据')
          return false
        }
        var day1 = new Date(this.query_time_start)
        var day2 = new Date(this.query_time_end)
        const dateInfo = (day2 - day1) / (1000 * 60 * 60 * 24)
        if (dateInfo > 39) {
          this.$message.warning('每次查询不能超过40天')
          return
        } else if (day1 > day2) {
          this.$message.warning('结束日期不能小于开始日期')
          return
        }
        const {
          query_name,
          query_department,
          query_time_start,
          query_time_end,
          rownum,
          pagenum
        } = this
        let time = ''
        let dailysignInfo = ''
        let query_token = Math.random()
        const userInfo = this.$store.state.login.userInfo
        // const web = this.getBrowser()
        // const webType = web === 'IE' ? '0' : web === 'Chrome' ? '1' : web === 'Firefox' ? '2' : '3'
        if (!exportStatus) {
          axios
            .get(mode === 'old' ? '/pcapi/sign/signcount_export_old' : '/pcapi/sign/signcount_export', {
              params: mode === 'old' ? {
                query_time_start,
                query_time_ends: query_time_end,
                user_id: userInfo.uid,
                query_token
              } : {
                // token,
                query_name,
                query_department,
                query_time_start,
                query_time_ends: query_time_end,
                user_id: userInfo.uid,
                query_token
                // webType,
              }
            })
            .then(dailysignInfo => {
              this.dailysignInfo = dailysignInfo.data
            })
          let percentage = 0
          this.exportStatus = true
          this.dialogVisible = true
          interval = setInterval(() => {
            axios
              .get('/pcapi/sign/record_signcount_percent', {
                params: {
                  query_token,
                  time: new Date().getTime()
                }
              })
              .then(dailysignPercent => {
                percentage = dailysignPercent.data
                this.percentage = dailysignPercent.data
                if (percentage >= 100) {
                  clearInterval(interval)
                  axios
                    .get('/pcapi/sign/getfilename', {
                      params: {
                        query_token
                      }
                    })
                    .then((filename) => {
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
          }, 500)
        }
      },

      // 查询
      onSearch () {
        this.pagenum = 1
        this.pulicCheck()

        // checkstatistic/outcheckattendance?employee_id=${dailyItem.employee_id}&enterprise_id=${dailyItem.enterprise_id}&employee_name=${dailyItem.employee_name}&checktime_id=${dailyItem.checktime_id}&query_time_start=${query_time_start}&query_time_end=${query_time_end}`
      },

      // 切换 page
      handleCurrentChange (val) {
        this.pagenum = val
        this.pulicCheck()
      },

      // public 查询
      async pulicCheck () {
        const {
          query_name,
          query_department,
          query_time_start,
          query_time_end,
          rownum,
          pagenum
        } = this
        if (!query_time_start || !query_time_end) {
          this.$message.warning('查询日期不能为空')
          return false
        }
        var day1 = new Date(query_time_start)
        var day2 = new Date(query_time_end)
        const dateInfo = (day2 - day1) / (1000 * 60 * 60 * 24)
        if (dateInfo > 39) {
          this.$message.warning('每次查询不能超过40天')
          return false
        } else if (day1 > day2) {
          this.$message.warning('结束日期不能小于开始日期')
          return false
        }
        history.pushState({}, '', `${location.href}?query_name=${this.query_name}&query_department=${this.query_department}&query_time_start=${this.query_time_start}&query_time_end=${this.query_time_end}`)
        this.loading = true
        const userInfo = this.$store.state.login.userInfo
        let dailysign = await
        axios.get('/pcapi/sign/signcount', {
          params: {
            // token,
            query_name,
            query_department,
            query_time_start,
            query_time_end,
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

    .checkstatistic {
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
                // display: flex;
                // flex-direction: column;
                // justify-content: space-between;
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
                        /*display: inline-flex;*/
                        float: right;
                        /*flex-direction: column;*/
                        /*align-items: flex-end;*/
                        position: relative;
                        .export_tip {
                            position: absolute;
                            bottom: -20px;
                            right: 0;
                            color: #999;
                        }
                        .form_export {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: auto;
                            padding: 0 15px;
                            margin-left: 10px;
                            height: 28px;
                            background-color: #ffffff;
                            border-radius: 14px;
                            border: solid 1px #0c7ff5;
                            color: #0c7ff5;
                            font-size: 13px;
                            /*margin-left: 126px;*/
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
                    // height: 782px;
                    height: 690px;
                    width: 100%;
                    flex-direction: column;
                    justify-content: space-between;
                    .check_ul {
                        margin-top: 24px;
                        .check_list_title {
                            height: 40px;
                            display: flex;
                            align-items: center;
                            border-top: 1px solid #deeaf5;
                            border-bottom: 1px solid #deeaf5;
                            .check_list_item {
                                display: inline-block;
                                flex: 1;
                                text-align: center;
                                &:last-child {
                                    margin-right: 26px;
                                }
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
                                span {
                                    display: inline-block;
                                    flex: 1;
                                    text-align: center;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .check_link {
                                    display: inline-block;
                                    width: 106px;
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
