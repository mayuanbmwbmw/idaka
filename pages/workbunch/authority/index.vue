<template>
    <section class="authority">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
                        <BreadcrumbItem to="">权限控制</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table" v-loading="loading">
                <no-ssr>
                    <el-form class="check_table_inline" inline>
                        <div class="form_box">
                            <label class="form_title" for="">姓名：</label>
                            <el-input v-model="query_name" class="form_content" type="text" placeholder="请输入姓名"
                                      @change="onSearch"></el-input>
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
                        <span class="form_search" @click="onSearch">查询</span>
                    </el-form>
                </no-ssr>
                <div class="check_container">
                    <ul class="check_ul">
                        <li class="check_list_title">
                            <span class="list_item">工号</span>
                            <span class="list_item">姓名</span>
                            <span class="list_item">所在部门</span>
                            <span class="list_item">操作</span>
                        </li>
                        <div class="check_list_box" v-if="authority && authority.length > 0">
                            <li class="check_list" v-for="(item, index) in authority" :key="index">
                                <span class="list_item">{{ item.work_number || '无' }}</span>
                                <div class="list_user">
                                    <span class="user_name">{{ item.name || '无' }}</span>
                                    <!--<div class="user_status" v-if="item.permission >= 16777215">-->
                                    <div class="user_status" v-if="item.if_owner == 1">
                                        <img src="~/static/img/workbunch/icon_company.png" alt="" class="user_icon">
                                        <span class="user_company">企业拥有者</span>
                                    </div>
                                </div>
                                <span class="list_item">{{ item.department || '未分组员工' }}</span>
                                <span class="check_link" @click="onControl(item)">权限控制</span>
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
                <Modal class="modify_modal" v-model="modal" width="660" :mask="showmask">
                    <p class="modal_title" slot="header">修改企业资料</p>
                    <div class="modal_container" style="width: auto">
                        <div class="modal_content">
                            <p class="modal_name">请为<span>{{editName}}</span>分配权限</p>
                            <p class="modal_tag" v-if="canzhuanrang" @click="zhuanrang">
                                <img src="" alt="" class="tag_img">
                                <span class="tag_name">转让企业</span>
                            </p>
                        </div>
                        <div class="switch_box">
                            <div class="switch_item" v-for="(item, index) in authority_listItem">
                                <span class="switch_tag">{{item.label}}</span>
                                <i-switch class="switch_btn" v-model="item.pr" @on-change="change(item)"
                                          size="default"/>
                            </div>
                        </div>
                    </div>
                    <div class="modal_footer" slot="footer">
                        <span class="modal_allow" @click="onConfirm">确认</span>
                        <span class="modal_refuse" @click="onCancel">取消</span>
                    </div>
                </Modal>
            </no-ssr>
        </div>
        <trfooter></trfooter>
    </section>
</template>
<script>
  // 插件
  import axios from '~/plugins/axios'

  // 组件
  import {Switch} from 'iview'
  import navbar from '~/components/common/navbar'
  import trfooter from '~/components/common/trfooter'
  import excel from '~/components/common/excel'

  // 文件

  import icon_check from '~/static/img/workbunch/icon_check.png'

  let statusArr = []
  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter,
      'i-switch': Switch,
      excel
    },
    head() {
      return {
        title: '卓朗科技_权限控制'
      }
    },
    data() {
      return {
        modal: false,
        showmask: true,
        total: '',
        fileName: '',
        filterTitle: '',
        filterList: '',
        query_name: '',
        query_department: '',
        query_date: '',
        rownum: 16,
        pagenum: 1,
        currentPage: 1,
        authority: '',
        exportList: '',
        departments: '',
        loading: false,
        authority_list: '',
        authority_listItem: [
          // {value: 16777215, label: '企业业主'},
          // {value: 1, label: '员工管理-读取'},
          // {value: 2, label: '员工管理-写入'},
          // {value: 4, label: '员工管理-审核'},
          // {value: 8, label: '打卡设置'},
          // {value: 16, label: '企业管理'},
          // {value: 32, label: '考勤统计-读取'},
          // {value: 64, label: '考勤统计-写入'},
          // {value: 128, label: '发布通知'},
          // {value: 8388608, label: '转让企业、权限分配'},
          // {value: 1073741824, label: '超级管理员权限'}
        ],
        canzhuanrang: false,
        editId: '',
        editName: ''
      }
    },
    // 权限信息获取
    async asyncData({store}) {
      let userInfo = store.state.login.userInfo
      try {
        let authority = await axios.get('/pcapi/authority', {
          params: {
            // token,
            rownum: 16,
            pagenum: 1,
            user_id: userInfo.uid,
            enterprise_id: userInfo.enterprise_id
          }
        })
        const {data} = authority
        if (data.code === 0) {
          return {
            authority: data.data,
            departments: data.departments,
            total: data.pages,
          }
        }
      } catch (e) {
        console.log('error', e)
      }
    },
    methods: {
      // 查询
      onSearch() {
        this.pagenum = 1
        this.pulicCheck()
      },
      // 切换 page
      handleCurrentChange(val) {
        this.pagenum = val
        this.pulicCheck()
      },
      async pulicCheck() {
        // alert(this.pagenum)
        let userInfo = this.$store.state.login.userInfo
        const {query_name, query_department, rownum, pagenum} = this
        let dailysign = await axios.get('/pcapi/authority', {
          params: {
            query_name,
            query_department,
            rownum,
            pagenum,
            user_id: userInfo.uid,
            enterprise_id: userInfo.enterprise_id
          }
        })
        const {data} = dailysign
        this.authority = data.data
        this.total = data.pages
      },
      onConfirm() {
        this.modal = false
        this.pulicCheck()
        this.$Message.success('您已修改权限控制')
      },
      onCancel() {
        this.modal = false
      },
      async onControl(item) {
        item.name && (this.editName = item.name)
        this.canzhuanrang = item.permission === (0 || null)
        this.editId = item.eid
        let userInfo = this.$store.state.login.userInfo
        // const { query_name, query_department, query_date, rownum, pagenum } = this
        let dailysign = await axios.get('/pcapi/authority/authority_list', {
          params: {
            user_id: userInfo.uid,
            employee_id: item.eid
          }
        })
        const {data} = dailysign
        // this.authority_listItem === [] && (this.authority_listItem = data.permissons)
        this.authority_listItem = data.permissons
        console.log(this.authority_listItem)
        this.authority_listItem.forEach((e, index) => {
          e.pr = (data.eauthority[index] !== 0)
        })
        this.modal = true
      },
      async change(item) {
        const that = this
        let userInfo = this.$store.state.login.userInfo
        let dailysign = await axios.get('/pcapi/authority/authority_changed', {
          params: {
            user_id: userInfo.uid,
            employee_id: that.editId,
            new_permission: item.value
          }
        })
        const {data} = dailysign
        this.onControl({eid: that.editId})
        // status.value
        // statusArr.push(status)
        // this.$Message.info("开关状态：" + statusArr);
      },
      async zhuanrang() {
        const that = this
        let userInfo = this.$store.state.login.userInfo
        let dailysign = await axios.get('/pcapi/authority/authority_transfer', {
          params: {
            user_id: userInfo.uid,
            employee_id: that.editId
          }
        })
        const {data} = dailysign
        this.$Message.success('转让成功！')
        this.canzhuanrang = false

        this.pulicCheck()
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

    // Modal
    .modify_modal {
        .ivu-modal {
            top: 100px !important;
            .ivu-modal-content {
                width: 584px;
                padding-bottom: 8px;
            }
            .ivu-modal-header {
                border: none;
            }
            .ivu-modal-body {
                padding-top: 0px;
                padding-bottom: 0px;
            }
            .ivu-modal-footer {
                border: none;
                padding-top: 58px;
            }
            .modal_title {
                color: #333333;
                font-size: 18px;
                position: relative;
                top: 10px;
                left: 20px;
            }
            .modal_container {
                display: flex;
                flex-direction: column;
                padding-left: 20px;
                .modal_content {
                    .modal_name {
                        color: #333333;
                        font-size: 14px;
                        line-height: 14px;
                        margin: 6px 0 10px;
                        span {
                            color: #0c7ff5;
                            display: inline-block;
                            margin: 0 6px;
                        }
                    }
                    .modal_tag {
                        width: 108px;
                        height: 24px;
                        background-color: #ffffff;
                        border-radius: 12px;
                        border: solid 1px #0c7ff5;
                        color: #0c7ff5;
                        font-size: 13px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        .tag_img {
                            width: 12px;
                            height: 15px;
                            margin: 0 8px 0 11px;
                        }
                    }
                }
                .switch_box {
                    display: flex;
                    align-items: center;
                    margin-top: 58px;
                    flex-wrap: wrap;
                    .switch_item {
                        display: flex;
                        align-items: center;
                        width: auto;
                        margin-right: 20px;
                        margin-bottom: 62px;
                        .switch_tag {
                            color: #333333;
                            font-size: 13px;
                            margin-right: 10px;
                        }
                        .switch_btn {
                            width: 42px;
                            height: 18px;
                            &::after {
                                width: 14px;
                                height: 14px;
                            }
                        }
                        .ivu-switch-checked {
                            &::after {
                                left: 25px;
                            }
                        }
                    }
                }
            }
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

    .authority {
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
                padding: 34px 0;
                height: 845px;
                overflow: hidden;
                box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
                border-radius: 10px;
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
                .check_container {
                    display: flex;
                    height: 782px;
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
                            .list_item {
                                display: inline-block;
                                width: 25%;
                                text-align: center;
                                &:last-child {
                                    margin-right: 26px;
                                }
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
                                .list_item {
                                    display: inline-block;
                                    width: 25%;
                                    text-align: center;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .list_user {
                                    display: flex;
                                    align-items: center;
                                    width: 25%;
                                    justify-content: center;
                                    .user_name {
                                    }
                                    .user_status {
                                        display: flex;
                                        align-items: center;
                                        width: 108px;
                                        height: 24px;
                                        background-color: #ffffff;
                                        border-radius: 12px;
                                        border: solid 1px #66d3c1;
                                        margin-left: 10px;
                                        .user_icon {
                                            width: 12px;
                                            height: 15px;
                                            margin: 0 8px 0 6px;
                                        }
                                        .user_company {
                                            font-size: 13px;
                                            color: #999999;
                                        }
                                    }
                                }
                                .check_link {
                                    display: inline-block;
                                    width: 25%;
                                    text-align: center;
                                    margin-right: 26px;
                                    color: #0c7ff5;
                                    cursor: pointer;
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
        }
    }

    .modify_modal .ivu-modal .modal_container .switch_box .switch_item .switch_tag {
        white-space: nowrap;
    }
</style>