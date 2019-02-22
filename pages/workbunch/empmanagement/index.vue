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
                        <BreadcrumbItem to="">员工审核</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table">
                <ul class="check_ul">
                    <li class="check_list_title">
                        <span>姓名</span>
                        <span>电话</span>
                        <span>操作</span>
                    </li>
                    <div class="check_list_box">
                        <li class="check_list" v-for="(item, index) in list" :key="index">
                            <p class="list_style">
                                <img :src="item.userdata.portraitUri || avatar" alt="" class="list_headimg">
                                <span>{{item.userdata.name}}</span>
                            </p>
                            <span class="list_style">{{item.userdata.phone}}</span>
                            <div class="list_style operate">
                                <span class="operate_allow" @click="onAllowing(item)">允许</span>
                                <span class="operate_refuse" @click="onRefusing(item)">拒绝</span>
                            </div>
                        </li>
                    </div>
                </ul>
                <no-ssr>
                    <!--<Page :total="100" :page-size="10" show-total/>-->
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="pagenum"
                            :page-size="10"
                            layout="total, prev, pager, next"
                            :page-count="parseInt(total)">
                    </el-pagination>
                </no-ssr>
            </div>
        </div>
        <Modal class="permit_modal" v-model="modal" width="360" :mask="showmask" :closable="closable">
            <!-- <p slot="header"></p> -->
            <div class="modal_question">
                <p class="question_info">{{allowtype === 1 ? '允许' : '拒绝'}}<span
                        class="question_name">{{allowName}}</span>加入公司？</p>
            </div>
            <div class="modal_footer" slot="footer">
                <span v-if="allowtype===1" class="modal_allow" @click="allowJoining">允许</span>
                <span v-if="allowtype===-1" class="modal_allow" @click="allowJoining">拒绝</span>
                <span class="modal_refuse" @click="modal=false">取消</span>
            </div>
        </Modal>
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
  import avatar from '~/static/img/user/avatar.png'

  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter
    },
    head () {
      return {
        title: '卓朗科技_员工审核'
      }
    },
    data () {
      return {
        formItem: {
          input: ''
        },
        avatar: avatar,
        pagenum: 1,
        total: 16,
        modal: false,
        showmask: false,
        closable: false,
        allowName: '',
        allowtype: 1,
        allowid: '',
        currentPage: 1,

        list: [
          // {
          //   'apply_id': '0093c0c8e15e428caff929e965cd7dc7',
          //   'name': '杭春林',
          //   'phone': '18630431557'
          // },
          // {
          //   'apply_id': '526315be5f944be7b312a16de7a756ab',
          //   'name': '魏晓明',
          //   'phone': '18021258906'
          // }
        ],
        baseParams: {
          user_id: this.$store.state.login.userInfo.uid,
          enterprise_id: '1'
        }
      }
    },
    async asyncData ({store}) {
      let dailysign = await axios.get('/pcapi/employee_manage/employee_verify', {
        params: {
          user_id: store.state.login.userInfo.uid,
          enterpriseId: '1',
          pagenum: '1',
          rownum: '16'
        }
      })
      const {data} = dailysign
      if (data.code === 0) {
        return {
          list: data.data,
          total: data.pages
        }
      }
    },

    methods: {
      // 员工审核
      async employee_verify (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/employee_verify', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 进行审核
      async check_employee (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/check_employee', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },

      // 切换 page
      handleCurrentChange (val) {
        this.pagenum = val
        this.employee_verify({
          user_id: this.$store.state.login.userInfo.uid,
          pagenum: val,
          rownum: '10'
        })
      },
      // 允许加入公司
      onAllowing (obj) {
        this.allowtype = 1
        this.allowid = obj.apply_id
        this.allowName = obj.userdata.name
        const {modal} = this
        if (modal === false) {
          this.modal = true
          // this.allowName = '允许'
        }
      },
      // 拒绝加入公司
      onRefusing (obj) {
        this.allowtype = -1
        this.allowid = obj.apply_id
        this.allowName = obj.userdata.name
        const {modal} = this
        if (modal === false) {
          this.modal = true
        }
        // const {modal} = this
        // if (modal === false) {
        //   this.$Message.success('已拒绝王**加入公司')
        // }
      },
      allowJoining () {
        const _this = this
        _this.check_employee({
          user_id: _this.$store.state.login.userInfo.uid,
          apply_id: _this.allowid,
          state: _this.allowtype
        }).then(res => {
          _this.modal = false
          _this.$Message.success((_this.allowtype === 1 ? '已允许' : '已拒绝') + _this.allowName + '加入公司')
          _this.employee_verify({
            user_id: _this.$store.state.login.userInfo.uid,
            pagenum: _this.pagenum,
            rownum: '10'
          }).then(res => {
            _this.list = res.data
          })
        })
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

    .permit_modal {
        .ivu-modal {
            top: 290px !important;
            .ivu-modal-content {
                width: 364px;
                height: 212px;
            }
            .ivu-modal-header {
                border: none;
            }
            .ivu-modal-body {
                padding-top: 80px;
                padding-bottom: 65px;
                .modal_question {
                    text-align: center;
                    color: #333333;
                    font-size: 18px;
                    line-height: 18px;
                    .question_name {
                        color: #0c7ff5;
                    }
                }
            }
            .ivu-modal-footer {
                border: none;
                padding: 0;
                margin-right: 20px;
                .modal_footer {
                    .modal_allow {
                        width: 90px;
                        height: 28px;
                        background-color: #0c7ff5;
                        border-radius: 14px;
                        font-size: 13px;
                        color: #ffffff;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }
                    .modal_refuse {
                        width: 90px;
                        height: 28px;
                        background-color: #ffffff;
                        border-radius: 14px;
                        border: solid 1px #0c7ff5;
                        font-size: 13px;
                        color: #0c7ff5;
                        margin-left: 20px;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .checkdaily {
        margin-top: 84px;
        background-color: #f1f4f8;
        .check_main {
            width: 1200px;
            margin: 0 auto;
            padding-bottom: 50px;
            .breadcrumb {
                margin: 0px 0 10px;
                .breadcrumb_item {
                    color: #999999;
                    font-size: 12px;
                }
            }
            .check_table {
                padding-top: 34px;
                height: 845px;
                overflow: hidden;
                box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
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
                            .ivu-input {
                                width: 110px;
                                height: 30px;
                                border-radius: 2px;
                                border: solid 1px #a3b8cc;
                            }
                        }
                        .form_department {
                            width: 210px;
                            height: 30px;
                            border-radius: 2px;
                            // border: solid 1px #a3b8cc;
                        }
                        .form_date {
                            width: 130px !important;
                            .ivu-input {
                                height: 30px;
                                border-radius: 2px;
                                border: solid 1px #a3b8cc;
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
                    }
                }
                .check_ul {
                    // margin-top: 24px;
                    .check_list_title {
                        height: 40px;
                        display: flex;
                        align-items: center;
                        // border-top: 1px solid #deeaf5;
                        border-bottom: 1px solid #deeaf5;
                        span {
                            display: inline-block;
                            width: 33.33%;
                            text-align: center;
                        }
                    }
                    .check_list_box {
                        .check_list {
                            height: 40px;
                            display: flex;
                            align-items: center;
                            &:nth-child(2n) {
                                background-color: #f4f7fa;
                            }
                            .list_style {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                width: 33.33%;
                                text-align: center;
                                .list_headimg {
                                    width: 24px;
                                    height: 24px;
                                    border-radius: 50%;
                                    margin-right: 11px;
                                    background-color: #eeeeee;
                                }
                            }
                            .operate {
                                width: 33.33%;
                                text-align: center;
                                .operate_allow {
                                    color: #0c7ff5;
                                    font-size: 13px;
                                    cursor: pointer;
                                }
                                .operate_refuse {
                                    color: #0c7ff5;
                                    font-size: 13px;
                                    margin-left: 20px;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }
        }
        .prompt_box {
        }
    }
</style>