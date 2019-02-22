<template>
    <section class="batchExport">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
                        <BreadcrumbItem to="/workbunch/empmanagement/department">部门管理</BreadcrumbItem>
                        <BreadcrumbItem to="">批量导入/批量导出</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table" v-loading="loading" element-loading-text="拼命加载中">
                <no-ssr>
                    <el-form class="check_table_inline" inline>
                        <el-button size="small" round @click="pageType = 1" v-show="pageType === 2">批量导入员工</el-button>
                        <el-button type="primary" size="small" round @click="" v-show="pageType === 1">批量导入员工
                        </el-button>
                        <el-button size="small" round style="margin-left: 20px" @click="pageType = 2"
                                   v-show="pageType === 1">批量导出员工
                        </el-button>
                        <el-button type="primary" size="small" round style="margin-left: 20px" @click=""
                                   v-show="pageType === 2">批量导出员工
                        </el-button>
                    </el-form>
                </no-ssr>
                <div class="check_container">
                    <h2 class="mb-20">步骤</h2>
                    <div class="mysteps" v-if="pageType === 1">
                        <div class="mystep">
                            <div class="content">
                                <span class="mr-20">下载“通讯录导入模板”</span>
                                <el-button type="primary" size="small" @click="contactsTemplate">下载</el-button>
                            </div>
                        </div>
                        <div class="mystep">
                            <div class="content">
                                <span class="mr-20">在下载模板中填写员工相关信息</span>
                            </div>
                        </div>
                        <div class="mystep">
                            <no-ssr>
                                <div class="content">
                                    <span class="mr-20">选择填写好的通讯录表格</span>
                                    <el-button type="primary" size="small" style="position: relative" v-if="!uploadA">
                                        选择上传文件
                                    </el-button>
                                    <input type="file" id="" class="uploadBtn" v-if="!uploadA"
                                           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                           @change='onUploadA'>
                                    <div class="uploadfile" v-if="uploadA">
                                        <span>{{uploadNameA}}</span>
                                        <div class="closer el-icon-close" @click="uploadNameA = uploadA = null"></div>
                                    </div>
                                </div>
                            </no-ssr>
                        </div>
                        <div class="mystep">
                            <div class="content">
                                <span class="mr-20">上传填写好的通讯录表格</span>
                                <el-button type="primary" size="small" @click="uploadFileA">上传</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="mysteps" v-if="pageType === 2">
                        <div class="mystep">
                            <div class="content">
                                <span class="mr-20">选择部门</span>
                                <no-ssr>
                                    <el-select class="form_department" v-model="query_department" placeholder="请选择"
                                               size="small"
                                               @change="">
                                        <el-option label="全部" value="">
                                        </el-option>
                                        <el-option
                                                v-for="(item, index) in departments"
                                                :key="index"
                                                :label="item.depart_name"
                                                :value="item.department_id">
                                        </el-option>
                                    </el-select>
                                </no-ssr>
                            </div>
                        </div>
                        <div class="mystep">
                            <div class="content">
                                <span class="mr-20">企业通讯录</span>
                                <el-button type="primary" size="small" @click="enterpriseContact">导出</el-button>
                            </div>
                        </div>
                        <div class="mystep">
                            <no-ssr>
                                <div class="content">
                                    <span class="mr-20">选择填写好的通讯录表格</span>
                                    <el-button type="primary" size="small" style="position: relative" v-if="!uploadB">
                                        选择上传文件
                                    </el-button>
                                    <input type="file" id="" class="uploadBtn" v-if="!uploadB"
                                           accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                           @change='onUploadB'>
                                    <div class="uploadfile" v-if="uploadB">
                                        <span>{{uploadNameB}}</span>
                                        <div class="closer el-icon-close" @click="uploadNameB = uploadB = null"></div>
                                    </div>
                                </div>
                            </no-ssr>
                        </div>
                        <div class="mystep">
                            <div class="content">
                                <span class="mr-20">上传填写好的通讯录表格</span>
                                <el-button type="primary" size="small" @click="uploadFileB">上传</el-button>

                            </div>
                        </div>
                    </div>

                    <h2 class="mb-20 mt-20">注意</h2>
                    <p class="lh-30">1.不能在模板excel表中对员工信息类别进行增加、删除、修改，否则无法识别；</p>
                    <p class="lh-30">2.请务必核实员工手机号，否则将视为无效信息；</p>
                    <p class="lh-30">3.存在重复人员（以手机号鉴别）时，将覆盖原有信息，请务必确认信息的准确性以及保证成员信息的正确录入；</p>
                    <p class="lh-30">4.上传人数不能超过500人；</p>
                </div>
            </div>
            <no-ssr>
                <el-dialog
                        :visible.sync="dialogVisible"
                        :show-close="false"
                        width="30%"
                        :close-on-click-modal="false"
                        :custom-class="'progressDialog'"
                >
                    <h3 class="mb-20">{{progessText}}</h3>
                    <h6 class="mb-20" v-show="progessFailTip">{{progessFailTip}}</h6>
                    <!--status="success"-->
                    <!--status="exception"-->
                    <el-progress v-if="exportStatus" type="circle" :status="checkstatic"
                                 :percentage="percentage"></el-progress>
                    <div class="t-a-c pt-20">
                        <el-button size="small" round style="min-width: 100px" @click="closeProgressDialog"
                                   v-if="isTransmission">取消
                        </el-button>
                        <el-button size="small" round style="min-width: 100px" @click="closeProgressDialog" v-else>确定
                        </el-button>
                    </div>
                </el-dialog>
            </no-ssr>
        </div>
        <trfooter></trfooter>
    </section>
</template>
<script>
  // 插件
  import $ from 'jquery'
  import axios from '~/plugins/axios'
  import qs from 'qs'

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
    head() {
      return {
        title: '卓朗科技_部门管理_导入导出'
      }
    },
    data() {
      return {
        userInfo: this.$store.state.login.userInfo,
        total: '',
        date: '',
        fileName: '',
        filterTitle: '',
        filterList: '',
        query_name: '',
        query_department: '',
        departments: '',
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

        progessText: '',
        progessFailTip: '',
        pageType: 1,
        // 上传文件
        uploadA: null,
        uploadB: null,
        uploadNameA: null,
        uploadNameB: null,
        isTransmission: false,
        transmissioninterval: null,
        closeProgressDialogTimeout: null,
        // 提示信息
        tipText: {
          startDownload: '已开始下载',
          cantDownload: '出现未知错误，未能下载',
          needFile: '请选择要上传的文件！',
          wrongType: '格式不正确，请选择表格类型的文件',
          wrongFile: '导入信息中含错误信息，错误信息不予导入',
          success: '上传成功',
          failed: '上传失败！',
          noRes: '服务器开小差啦'
        }

      }
    },
    // 初始化 企业列表
    async asyncData({store}) {
      let userInfo = store.state.login.userInfo
      try {
        let dailysign = await axios.get('/pcapi/sign/dailysign', {
          params: {
            // token,
            rownum: 14,
            pagenum: 1,
            query_date: '2018-10-01',
            user_id: userInfo.uid,
            enterprise_id: userInfo.enterprise_id
          }
        })
        const {data} = dailysign
        if (data.code === 0) {
          return {
            departments: data.departments
          }
        }
      } catch (e) {
        console.log('error', e)
      }
    },
    mounted() {

    },
    methods: {
      // 下载通讯录模板A
      contactsTemplate() {
        // const that = this
        // axios.get('/pcapi/employee_manage/download_template',
        //   {
        //     params: {
        //       user_id: that.userInfo.uid
        //     }
        //   }
        // ).then(res => {
        //   if (res.data) {
        //     this.$message({type: 'success', message: this.tipText.startDownload})
        this.$message({type: 'success', message: this.tipText.startDownload})

        // window.open(`http://172.27.106.5:8002/sign/export_download?filename=upload/通讯录模板.xlsx`, '_self')
        location.href = `${location.protocol}//${location.host}/upload/通讯录模板.xlsx`

        // } else {
        //   this.$message.error(this.tipText.cantDownload)
        // }
        // })
      },
      // 上传A监听
      onUploadA(e) {
        // console.log(e.target.files[0].type)
        if (!(e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          e.target.files[0].type === 'application/vnd.ms-excel')) {
          this.$message({message: this.tipText.wrongType, type: 'error'})
          return false
        }
        this.uploadA = e.target.files[0]
        this.uploadNameA = this.uploadA.name
      },
      // 上传A
      uploadFileA() {
        if (!this.uploadA) {
          this.$message.error(this.tipText.needFile)
          return false
        }
        const that = this
        const random = Math.random()
        let isSuccess = false
        let count = 0

        const formData = new FormData()
        formData.append('user_id', that.userInfo.uid)
        formData.append('query_token', random)
        formData.append('file', that.uploadA)

        that.openProgressDialog(`正在上传 ${this.uploadNameA}`)

        function getPercent() {
          axios.get('/pcapi/employee_manage/upload_percent', {
            params: {
              query_token: random
            }
          }).then(res => {
            // if (!res.data) {
            //   that.transmissionFailed()
            //   return false
            // }
            if (!isSuccess) {
              // 上传错误判断
              if (that.percentage === res.data) {
                count++
                if (count > 10) {
                  that.transmissionFailed(that.tipText.failed)
                }
              } else {
                count = 0
              }
              that.percentage = res.data
              if (that.percentage >= 100) {
                // that.transmissionSuccess(that.tipText.success)
                setTimeout(function () {
                  axios.get('/pcapi/employee_manage/upload_result', {
                    params: {
                      query_token: random
                    }
                  }).then(res => {
                    if (res.data.code === 0) {
                      if (res.data.errorlist.length === 0) {
                        isSuccess = true
                        that.percentage = 100
                        that.transmissionSuccess(that.tipText.success)
                      } else {
                        that.transmissionSuccess(that.tipText.success, that.tipText.wrongFile)
                      }
                    } else if (res.data.code === -1) {
                      that.transmissionFailed(res.data.msg)
                    } else {
                      // that.$message.error(that.tipText.failed)
                      that.transmissionFailed(res.data.msg)
                      return false
                    }
                  })
                }, 1000)
              }
            }
          })
        }

        getPercent()
        that.transmissioninterval = setInterval(() => {
          // 测试代码
          // that.percentage += 5
          // if (that.percentage >= 100) {
          //   that.transmissionSuccess(that.tipText.success)
          // }
          getPercent()
        }, 500)

        // axios.defaults.headers['Content-Type'] = 'multipart/form-data'
        axios.post('/pcapi/employee_manage/upload_sheet',
          // axios.post(process.env.SERVER + '/employee_manage/upload_sheet',
          formData
          // {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(res => {
          if (res.data.code === -1) {
            that.transmissionFailed(res.data.msg)
          }
          // if (res.data.code === 0) {
          //   if (res.data.errorlist.length === 0) {
          //     isSuccess = true
          //     that.percentage = 100
          //     that.transmissionSuccess(that.tipText.success)
          //   } else {
          //     that.transmissionSuccess(that.tipText.success, that.tipText.wrongFile)
          //   }
          // } else if (res.data.code === -1) {
          //   that.transmissionFailed(res.data.msg)
          // } else {
          //   that.transmissionFailed()
          //   // that.$message.error(that.tipText.failed)
          //   return false
          // }
        })
        //   .catch(res => {
        //   that.transmissionFailed(that.tipText.noRes)
        // })
      },
      // 导出企业通讯录
      enterpriseContact() {
        const that = this
        axios.get('/pcapi/employee_manage/export_enterprise_addressbook',
          {
            params: {
              department_id: that.query_department,
              user_id: that.userInfo.uid,
              query_token: Math.random(),
              filename: 'upload/通讯录模板.xlsx'
            }
          }
        ).then(res => {
          if (res.data) {
            this.$message({type: 'success', message: that.tipText.startDownload})
            location.href = `${location.protocol}//${location.host}/export/${res.data.split('/')[1]}`
          } else {
            this.$message.error(that.tipText.cantDownload)
          }
        })
      },
      // 上传B监听
      onUploadB(e) {
        // console.log(e.target.files[0].type)
        if (!(e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          e.target.files[0].type === 'application/vnd.ms-excel')) {
          this.$message({message: this.tipText.wrongType, type: 'error'})
          return false
        }
        this.uploadB = e.target.files[0]
        this.uploadNameB = this.uploadB.name
      },
      // 上传B
      uploadFileB() {
        if (!this.uploadB) {
          this.$message.error(this.tipText.needFile)
          return false
        }
        const that = this
        const random = Math.random()
        let isSuccess = false
        let count = 0

        const formData = new FormData()
        formData.append('user_id', that.userInfo.uid)
        formData.append('query_token', random)
        formData.append('file', that.uploadB)

        that.openProgressDialog(`正在上传 ${this.uploadNameB}`)

        function getPercent() {
          axios.get('/pcapi/employee_manage/addressbook_download_percent', {
            params: {
              query_token: random
            }
          }).then(res => {
            if (!isSuccess) {
              // 上传错误判断
              if (that.percentage === res.data) {
                count++
                if (count > 10) {
                  that.transmissionFailed(that.tipText.failed)
                }
              } else {
                count = 0
              }
              that.percentage = res.data
              if (that.percentage >= 100) {
                // that.transmissionSuccess(that.tipText.success)
                setTimeout(function () {
                  axios.get('/pcapi/employee_manage/upload_result', {
                    params: {
                      query_token: random
                    }
                  }).then(res => {
                    if (res.data.code === 0) {
                      if (res.data.errorlist.length === 0) {
                        isSuccess = true
                        that.percentage = 100
                        that.transmissionSuccess(that.tipText.success)
                      } else {
                        that.transmissionSuccess(that.tipText.success, that.tipText.wrongFile)
                      }
                    } else if (res.data.code === -1) {
                      that.transmissionFailed(res.data.msg)
                    } else {
                      // that.$message.error(that.tipText.failed)
                      that.transmissionFailed(res.data.msg)
                      return false
                    }
                  })
                }, 1000)
              }
            }
          })
        }

        getPercent()
        that.transmissioninterval = setInterval(() => {
          getPercent()
        }, 500)
        axios.post('/pcapi/employee_manage/upload_addressbook',
          formData
        ).then(res => {
          if (res.data.code === -1) {
            that.transmissionFailed(res.data.msg)
          }
        })
      },

      // 打开进度弹窗
      openProgressDialog(text) {
        this.isTransmission = true
        this.percentage = 0
        this.progessText = text || '正在传输...'
        this.exportStatus = true
        this.dialogVisible = true
      },
      // 关闭进度弹窗
      closeProgressDialog() {
        clearInterval(this.transmissioninterval)
        this.isTransmission = false
        this.checkstatic = ''
        this.progessText = ''
        this.progessFailTip = ''
        this.percentage = 0
        this.exportStatus = false
        this.dialogVisible = false
        this.uploadA = null
        this.uploadB = null
        this.uploadNameA = null
        this.uploadNameB = null
        clearTimeout(this.closeProgressDialogTimeout)
      },
      // 传输成功
      transmissionSuccess(text, tip, href) {
        const that = this
        clearInterval(this.transmissioninterval)
        this.percentage = 100
        that.checkstatic = 'success'
        that.progessText = text
        that.progessFailTip = tip
        this.isTransmission = false
        // this.closeProgressDialogTimeout = setTimeout(() => {
        //   // href && (location.href = `http://dakaapp.troila.com/export/${filename.data}`)
        //   that.closeProgressDialog()
        // }, 2000)
      },
      // 传输失败
      transmissionFailed(text) {
        const that = this
        clearInterval(this.transmissioninterval)
        this.percentage = 100
        that.checkstatic = 'exception'
        that.progessText = '传输失败，请重试'
        that.progessFailTip = text || ''
        this.isTransmission = false
        // this.closeProgressDialogTimeout = setTimeout(() => {
        //   that.closeProgressDialog()
        // }, 2000)
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

    .batchExport {
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
                    .form_export {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 15px;
                        min-width: 100px;
                        height: 28px;
                        background-color: #ffffff;
                        border-radius: 14px;
                        border: solid 1px #0c7ff5;
                        color: #0c7ff5;
                        font-size: 13px;
                        margin-right: 15px;
                        /*margin-left: 126px;*/
                        /*float: left;*/
                        cursor: pointer;
                    }
                    .form_export.deep {
                        border: solid 1px #0c7ff5;
                        background-color: #0c7ff5;
                        color: #fff;
                    }
                    .el-button {
                        margin-left: 10px;
                    }
                }
                .check_container {
                    /*display: flex;*/
                    height: 660px;
                    margin-top: 30px;
                    border-top: 1px solid #EAF1F9;
                    /*flex-direction: column;*/
                    /*justify-content: space-between;*/
                    padding: 25px 50px;
                    font-size: 14px;
                    // 分页
                    .ivu-page {
                        margin-top: 26px;
                        text-align: center;
                    }
                }
            }
        }
        .el-dialog__wrapper {
            z-index: 10000;
            .el-dialog.progressDialog {
                /*background: none;*/
                /*border: none;*/
                /*box-shadow: none;*/
                margin-top: 20vh !important;
                .el-dialog__header {
                    display: none;
                }
                .el-dialog__body {
                    text-align: center;
                }
            }
        }
    }

    .mysteps {
        position: relative;
        border-bottom: 1px solid #EAF1F9;;
        &:after {
            content: '';
            display: block;
            position: absolute;
            width: 18px;
            top: 20px;
            bottom: 70px;
            left: 0;
            background: url("../../../static/img/workbunch/steps.png");
        }
        .mystep {
            height: 86px;
            width: 100%;
            .content {
                padding-left: 25px;
                background: url("../../../static/img/workbunch/steppoint.png") no-repeat left center;
                .uploadfile {
                    position: relative;
                    display: inline-block;
                    line-height: 1;
                    white-space: nowrap;
                    background: #D6E6FF;
                    border: 1px solid #D6E6FF;
                    color: #606266;
                    -webkit-appearance: none;
                    text-align: center;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    outline: 0;
                    margin: 0;
                    -webkit-transition: .1s;
                    transition: .1s;
                    font-weight: 500;
                    font-size: 12px;
                    border-radius: 3px;
                    padding: 9px 15px;
                    .closer {
                        position: absolute;
                        right: -9px;
                        top: -8px;
                        border-radius: 50%;
                        text-align: center;
                        cursor: pointer;
                        font-size: 12px;
                        height: 15px;
                        width: 15px;
                        line-height: 16px;
                        vertical-align: middle;
                        color: #fff;
                        font-weight: bold;
                        background-color: #3D3D3D;
                        transition: all .3s;
                        &:hover {
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }
        .mystep:last-child {
            /*top: 0;*/
            /*background: url("../../../static/img/workbunch/steps.png") no-repeat left -86px;*/
        }
    }

    .uploadBtn {
        position: relative;
        top: 0;
        left: -100px;
        z-index: 10;
        bottom: 0;
        width: 100px;
        height: 32px;
        opacity: 0;
        cursor: pointer;
    }

    @import "../../../assets/css/common.css";
</style>
