<template>
    <section class="department">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
                        <BreadcrumbItem to="">部门管理</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table" v-loading="loading" element-loading-text="拼命加载中">
                <no-ssr>
                    <el-form class="check_table_inline" :model="formItem" inline>
                        <div class="form_box">
                            <label class="form_title" for="">部门：</label>
                            <el-select class="form_department" v-model="searchData" filterable clearable
                                       @change="changeSearch">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="x in departmentData2" :key="x.name" :label="x.name" :value="x.name">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="form_r" v-if="canedit">
                            <span class="pr-10 pt-5">拖拽节点可重新分配人员</span>
                            <span class="form_export" @click="addDepartment">添加部门</span>
                            <span class="form_export"
                                  @click="editDepartment">{{editStatus === 1 ? '编辑部门' : '结束编辑'}}</span>
                            <!--<span class="form_export" @click="clearSearch">清空搜索</span>-->
                            <span class="form_export" @click="$router.push('/workbunch/empmanagement/batchExport')">批量导入/批量导出</span>

                        </div>
                    </el-form>
                </no-ssr>

                <div class="panel_box">
                    <div class="panel_list" v-for="(item, index) in 3" :key="index">
                        <div class="list"
                             v-for="(panelItem, panelIndex) in departmentData && departmentData.filter((item, i) => i % 3 === index)"
                             :key="panelIndex">
                            <div class="panel_head" @click="onClickPanel(`${index}${panelIndex}`)"
                                 :customdata="`${index}${panelIndex}`">
                                <span class="head_title">{{panelItem.name}}</span>
                                <div class="head_r">
                                    <span v-if="editStatus === 1"
                                          :class="contains(`${index}${panelIndex}`, clickIndex) ? 'head_number_selected' : 'head_number'"></span>
                                    <span class="head_rename" v-if="editStatus === 2 && !panelItem.noGroup"
                                          @click="onRename(panelItem)">重命名</span>
                                    <!-- <span class="head_remote"  @click="onRemove">移除</span> -->
                                    <no-ssr>
                                        <Poptip v-if="editStatus === 2 && !panelItem.noGroup"
                                                class="el_tree_delete"
                                                confirm
                                                title="确认移除吗"
                                                @on-ok="deleteDe(panelItem)"
                                                @on-cancel="cancel">
                                            <Button class="list_quit">移除</Button>
                                        </Poptip>
                                    </no-ssr>
                                </div>
                            </div>

                            <no-ssr>
                                <div class="panelBody pb-15 pl-10 pr-10"
                                     v-show="contains(`${index}${panelIndex}`, clickIndex)">
                                    <ztree v-if="contains(`${index}${panelIndex}`, clickIndex)"
                                           :zNodes="panelItem.child" :parentId="panelItem.id" :edit="canedit"
                                           :noGroup="panelItem.noGroup"
                                           @onClickPanel="onClickPanel"></ztree>
                                </div>
                            </no-ssr>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <trfooter></trfooter>
    </section>
</template>
<script>
  // 插件
  import axios from '~/plugins/axios'
  // import $ from "jquery";

  // 图
  // import icon_check from "~/static/img/workbunch/icon_check.png";

  // 组件
  import navbar from '~/components/common/navbar'
  import trfooter from '~/components/common/trfooter'
  import ztree from '~/components/common/ztree.vue'
  import {EMPLOYEE_READ, EMPLOYEE_WRITER} from '~/utils/authority'
  // 文件

  // import icon_check from "~/static/img/workbunch/icon_check.png";

  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter,
      ztree
      // "el-tree": Tree
    },
    head() {
      return {
        title: '卓朗科技_打卡助手'
      }
    },
    data() {
      const sortData = (data) => {

      }
      return {
        searchData: '',
        formItem: {
          input: ''
        },
        canedit: false,
        total: 10,
        clickIndex: [],
        modal: false,
        showmask: true,
        editStatus: 1,
        alertStatus: -1,
        depIndex: -1,
        plus_modal: false,
        transfer_modal: false,
        detail_modal: false,
        clickStatus: 1,
        loading: true,

        departmentData: [],
        departmentData2: [],

        baseParams: {
          user_id: this.$store.state.login.userInfo.uid
          // enterprise_id: '1'
        },
        regexp: {
          // title: new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/),
          title: new RegExp(/^.{1,20}$/),
        },

      }
    },
    // async asyncData({store}) {
    //   let dailysign = await axios.get('/pcapi/employee_manage/department_manage', {
    //     params: {
    //       user_id: store.state.login.userInfo.uid,
    //       enterprise_id: '1'
    //     }
    //   })
    //   const {data} = dailysign
    //   if (data.code === 0) {
    //     let arr = []
    //     for (let i = 0; i < data.data.length; i++) {
    //       // 如果没有父级部门
    //       let obj = {}
    //       obj.name = data.data[i].department_name
    //       obj.department_id = obj.id = data.data[i].department_id
    //       obj.child = []
    //       obj.noGroup = false
    //       // 遍历子部门
    //       if (data.data[i].department_child) {
    //         for (let j = 0; j < data.data[i].department_child.length; j++) {
    //           let oh = {}
    //           oh.department_id = oh.id = data.data[i].department_child[j].department_id
    //           oh.pId = data.data[i].department_child[j].department_father
    //           oh.name = data.data[i].department_child[j].department_name
    //           obj.child.push(oh)
    //           for (let k = 0; k < data.data[i].department_child[j].department_employee.length; k++) {
    //             let ob = {}
    //             ob.employee_id = ob.id = data.data[i].department_child[j].department_employee[k].employee_id
    //             ob.pId = data.data[i].department_child[j].department_id
    //             ob.name = data.data[i].department_child[j].department_employee[k].employee_name
    //             obj.child.push(ob)
    //           }
    //         }
    //       }
    //
    //       // 遍历员工
    //       if (data.data[i].department_employee) {
    //         for (let j = 0; j < data.data[i].department_employee.length; j++) {
    //           let ob = {}
    //           ob.employee_id = ob.id = data.data[i].department_employee[j].employee_id
    //           ob.pId = data.data[i].department_id
    //           ob.name = data.data[i].department_employee[j].employee_name
    //           obj.child.push(ob)
    //         }
    //       }
    //
    //       arr.push(obj)
    //     }
    //     // 未分组员工
    //     let object = {
    //       child: [],
    //       department_id: '',
    //       id: '',
    //       name: '未分组员工',
    //       noGroup: true,
    //     }
    //     for (let l = 0; l < data.employee_without_department.length; l++) {
    //       let so = {}
    //       so.id = so.employee_id = data.employee_without_department[l].employee_id
    //       so.name = data.employee_without_department[l].employee_name
    //       so.pId = ''
    //       so.noGroup = true
    //       object.child.push(so)
    //     }
    //     arr.push(object)
    //     // console.log(arr)
    //     return {
    //       departmentData: arr,
    //       canedit: (store.state.login.userInfo.permissions & EMPLOYEE_WRITER) === EMPLOYEE_WRITER
    //     }
    //   }
    // },
    mounted() {
      const that = this
      // console.log((this.$store.state.login.userInfo.permissions & EMPLOYEE_WRITER) === EMPLOYEE_WRITER)
      // console.log(this.$store.state.login.userInfo)
      this.department_manage({
        user_id: this.$store.state.login.userInfo.uid,
      }).then(() => {
        that.departmentData2 = that.departmentData
      })
    },
    methods: {
      // 初始化 部门信息
      async department_manage(obj) {
        const that = this
        that.loading = true
        let dailysign = await axios.get('/pcapi/employee_manage/department_manage', {
          params: obj
        })
        const {data} = dailysign
        if (data.code === 0) {
          that.departmentData = []
          let arr = []
          for (let i = 0; i < data.data.length; i++) {
            // 如果没有父级部门
            let obj = {}
            obj.name = data.data[i].department_name
            obj.department_id = obj.id = data.data[i].department_id
            obj.child = []
            obj.noGroup = false
            // 遍历子部门
            if (data.data[i].department_child) {
              for (let j = 0; j < data.data[i].department_child.length; j++) {
                let oh = {}
                oh.department_id = oh.id = data.data[i].department_child[j].department_id
                oh.pId = data.data[i].department_child[j].department_father
                oh.name = data.data[i].department_child[j].department_name
                obj.child.push(oh)
                for (let k = 0; k < data.data[i].department_child[j].department_employee.length; k++) {
                  let ob = {}
                  ob.employee_id = ob.id = data.data[i].department_child[j].department_employee[k].employee_id
                  ob.pId = data.data[i].department_child[j].department_id
                  ob.name = data.data[i].department_child[j].department_employee[k].employee_name
                  obj.child.push(ob)
                }
              }
            }

            // 遍历员工
            if (data.data[i].department_employee) {
              for (let j = 0; j < data.data[i].department_employee.length; j++) {
                let ob = {}
                ob.employee_id = ob.id = data.data[i].department_employee[j].employee_id
                ob.pId = data.data[i].department_id
                ob.name = data.data[i].department_employee[j].employee_name
                obj.child.push(ob)
              }
            }

            arr.push(obj)
          }
          // 未分组员工
          if (!obj.query_department || obj.query_department === '未分组员工') {
            let object = {
              child: [],
              department_id: '',
              id: '',
              name: '未分组员工',
              noGroup: true,
            }
            for (let l = 0; l < data.employee_without_department.length; l++) {
              let so = {}
              so.id = so.employee_id = data.employee_without_department[l].employee_id
              so.name = data.employee_without_department[l].employee_name
              so.pId = ''
              so.noGroup = true
              object.child.push(so)
            }
            arr.push(object)
          }

          // console.log(arr)
          that.departmentData = arr
          that.canedit = (that.$store.state.login.userInfo.permissions & EMPLOYEE_WRITER) === EMPLOYEE_WRITER
          that.loading = false
          return Promise.resolve()
        }
      },
      // 部门编辑
      async submit_depart_change(obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/submit_depart_change', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 部门重命名 ok
      async department_rename(obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/department_rename', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 部门移除 ok
      async deleDepartment(obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/department_delete', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 添加部门-获取人员信息
      async employee_info(obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/employee_info', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 添加部门-提交添加结果 ok
      async newdepartment_add(obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/newdepartment_add', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.newdepartment_id)
        }
      },

      // 搜索
      changeSearch() {
        this.clickStatus = 1
        this.clickIndex = []
        const that = this
        this.department_manage({
          user_id: this.$store.state.login.userInfo.uid,
          query_department: this.searchData
        })
      },
      // clearSearch() {
      //   this.searchData = ''
      //   this.clickStatus = 1
      //   this.clickIndex = []
      //   this.department_manage({
      //     user_id: this.$store.state.login.userInfo.uid,
      //   })
      // },
      contains(obj, arr) {
        let i = arr.length
        while (i--) {
          if (arr[i] === obj) {
            return true
          }
        }
        return false
      },
      // 点击panel
      onClickPanel(index) {
        const {clickIndex, editStatus} = this
        if (!(this.contains(index, clickIndex)) && editStatus === 1) {
          this.clickIndex.push(index)
        } else {
          let idx = this.clickIndex.indexOf(index)
          if (idx > -1) {
            this.clickIndex.splice(idx, 1)
          }
        }
      },
      // 确定移除
      deleteDe(index) {
        const _this = this
        _this.deleDepartment({
          department_id: index.id
        }).then(res => {
          for (let i = 0; i < _this.departmentData.length; i++) {
            if (_this.departmentData[i].id === index.id) {
              _this.departmentData.splice(i, 1)
            }
          }
          _this.$Message.info('移除成功')
        })

        // let dailysign = axios.get('/pcapi/employee_manage/department_delete',
        //   {
        //     params: Object.assign({
        //       department_id: index.id
        //     }, this.baseParams)
        //   }
        // )
        // const {data} = dailysign
        // if (data.code === 0) {
        //   for (let i = 0; i < _this.departmentData.length; i++) {
        //     if (_this.departmentData[i].id === index.id) {
        //       _this.departmentData.splice(i, 1)
        //     }
        //   }
        //   _this.$Message.info('移除成功')
        // }
      },
      // 取消移除
      cancel() {
        this.$Message.info('取消移除')
      },
      // 添加部门
      addDepartment() {
        // this.modal = true
        // this.alertStatus = 1

        const _this = this
        _this.$prompt('', '新增部门', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputValue: '新增部门',
          inputPlaceholder: '新增部门',
          // inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/,
          inputValidator: function (value) {
            if (!value) {
              return '部门名称不能为空'
            }
            if (!(_this.regexp.title).test(value)) {
              return '部门名称不能超过15个字符'
            }
          }
          // inputErrorMessage: '部门名称不能为空'
        }).then((value) => {
          var val = value.value
          // var zTree = $.fn.zTree.getZTreeObj('tree')
          // var params = {
          //   'companyId': _this.companyId,
          //   'departmentPId': treeNode.id || -2,
          //   'departmentName': val
          // }
          // params.isFirstLevel = treeNode.level == 0 ? 1 : 0

          // 发请求
          _this.newdepartment_add({
            // user_id: _this.$store.state.login.userInfo.uid,
            department_name: val,
            department_employee: '',
            department_parent: ''
          }).then(res => {
            // _this.departmentData.push({
            //   name: val,
            //   id: res,
            //   department_id: res,
            //   child: []
            // })
            _this.department_manage({
              user_id: _this.$store.state.login.userInfo.uid,
            }).then(() => {
              _this.departmentData2 = _this.departmentData
            })
          })
          // addDepartment(params).then(response => {
          //   _this.isNowAdd = true
          //   zTree.addNodes(treeNode, { id: response.value.departmentId, name: val, userAmount: 0 })
          //   _this.$message({
          //     type: 'success',
          //     message: '添加成功'
          //   })
          // })
        }).catch(() => {
          // _this.$message({
          // type: 'info',
          // message: '取消添加'
          // });
        })
      },
      // 编辑部门
      editDepartment() {
        const {editStatus} = this
        if (editStatus === 1) {
          this.editStatus = 2
          this.clickStatus = 2
        } else {
          this.editStatus = 1
          this.clickStatus = 1
          this.clickIndex = []
        }
      },
      // 重命名
      onRename(index) {
        // this.modal = true
        // this.alertStatus = 2
        console.log(index)

        const _this = this
        _this.$prompt('您将重命名此部门', '部门重命名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: index.name,
          inputPlaceholder: '部门重命名',
          // inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/,
          inputValidator: function (value) {
            if (!value) {
              return '部门名称不能为空'
            }
            if (!(_this.regexp.title).test(value)) {
              return '部门名称不能超过15个字符'
            }
          }
          // inputErrorMessage: '部门名称不能为空'
        }).then((value) => {
          var val = value.value
          // var zTree = $.fn.zTree.getZTreeObj('tree')
          // var params = {
          //   'companyId': _this.companyId,
          //   'departmentPId': treeNode.id || -2,
          //   'departmentName': val
          // }
          // params.isFirstLevel = treeNode.level == 0 ? 1 : 0

          // 发请求
          _this.department_rename({
            // user_id: _this.$store.state.login.userInfo.uid,
            department_id: index.id,
            new_department_name: val
          }).then(res => {
            // _this.departmentData[index].name = val
            for (let i = 0; i < _this.departmentData.length; i++) {
              if (_this.departmentData[i].id === index.id) {
                _this.departmentData[i].name = val
              }
            }
          })
          // addDepartment(params).then(response => {
          //   _this.isNowAdd = true
          //   zTree.addNodes(treeNode, { id: response.value.departmentId, name: val, userAmount: 0 })
          //   _this.$message({
          //     type: 'success',
          //     message: '添加成功'
          //   })
          // })
        }).catch(() => {
          // _this.$message({
          // type: 'info',
          // message: '取消添加'
          // });
        })
      },
      // 移除部门
      onRemove(index) {
        const {depIndex} = this
        if (depIndex < 0 || depIndex !== index) {
          this.depIndex = index
        } else {
          this.depIndex = -1
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

    .panel_list {
        min-width: 340px;
    }

    .rename_modal {
        .ivu-modal {
            width: 484px !important;
            top: 290px !important;
            .ivu-modal-content {
                width: 484px;
                height: 232px;
            }
            .ivu-modal-close {
                top: 14px;
            }
            .ivu-modal-header {
                border: none;
                padding: 20px 16px 0 30px;
            }
            .ivu-modal-body {
                padding-top: 0px;
                padding-bottom: 0px;
            }
            .ivu-modal-footer {
                border: none;
                padding-top: 73px;
                padding-right: 30px;
            }
            .modal_title {
                color: #333333;
                font-size: 18px;
            }
            .modal_container {
                display: flex;
                flex-direction: column;
                padding-left: 20px;
                .modal_input {
                    width: 420px;
                    height: 34px;
                    background-color: #ffffff;
                    border-radius: 2px;
                    border: solid 1px #a3b8cc;
                    margin-top: 40px;
                    text-indent: 8px;
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

    .plus_modal {
        .ivu-modal {
            width: 584px !important;
            top: 290px !important;
            .ivu-modal-content {
                width: 584px;
                height: 502px;
                padding-bottom: 8px;
            }
            .ivu-modal-close {
                top: 14px;
                right: 14px;
            }
            .ivu-modal-header {
                border: none;
                padding: 20px 20px 0 30px;
            }
            .ivu-modal-body {
                padding: 0 20px 0 30px;
            }
            .ivu-modal-footer {
                border: none;
                padding: 26px 20px 0 30px;
            }
            .modal_title {
                color: #333333;
                font-size: 18px;
            }
            .modal_container {
                display: flex;
                margin-top: 22px;
                .modal_left {
                    width: 264px;
                    height: 365px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    border: solid 1px #dddddd;
                }
                .modal_right {
                    margin-left: 30px;
                    .right_title {
                        color: #1f1f33;
                        font-size: 13px;
                        margin: 0 0 4px 4px;
                    }
                    .right_ul {
                        height: 308px;
                        overflow-y: scroll;
                        .right_list {
                            height: 62px;
                            width: 260px;
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            background-color: white;
                            justify-content: space-between;
                            &:hover {
                                background-color: #f0f0f0;
                            }
                            .list_user {
                                display: inline-flex;
                                align-items: center;
                                .list_icon {
                                    width: 45px;
                                    height: 45px;
                                    margin-left: 4px;
                                    border-radius: 50%;
                                    background-color: #0c7ff5;
                                }
                                .list_name {
                                    color: #333333;
                                    font-size: 13px;
                                    margin-left: 8px;
                                    cursor: pointer;
                                }
                            }
                            .list_delete {
                                width: 19px;
                                height: 19px;
                                margin-left: 120px;
                                cursor: pointer;
                                background-color: #0c7ff5;
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
                .modal_last {
                    float: left;
                    margin-left: 0px;
                }
            }
        }
    }

    .transfer_modal {
        .ivu-modal {
            width: 704px !important;
            top: 290px !important;
            .ivu-modal-content {
                width: 704px;
                height: auto;
                padding-bottom: 8px;
            }
            .ivu-modal-close {
                top: 14px;
                right: 14px;
            }
            .ivu-modal-header {
                border: none;
                padding: 20px 20px 0 30px;
            }
            .ivu-modal-body {
                padding: 0 20px 0 30px;
                overflow: hidden;
            }
            .ivu-modal-footer {
                border: none;
                padding: 26px 20px 0 30px;
            }
            .modal_container {
                display: flex;
                margin-top: 22px;
                .modal_left {
                    .left_user {
                        display: flex;
                        align-items: center;
                        // margin: 30px 0 24px 36px;
                        margin-bottom: 24px;
                        .user_icon {
                            width: 58px;
                            height: 58px;
                            border-radius: 50%;
                            margin-right: 20px;
                            background-color: #999999;
                        }
                        .user_name {
                            color: #333333;
                            font-size: 18px;
                        }
                    }
                    .user_department_title {
                        color: #999999;
                        font-size: 13px;
                        line-height: 13px;
                    }
                    .user_department_content {
                        color: #333333;
                        font-size: 13px;
                        line-height: 13px;
                        margin-top: 16px;
                    }
                }
                .modal_right {
                    margin-left: 68px;
                    margin-top: 80px;
                    display: flex;
                    .right_title {
                        color: #999999;
                        font-size: 13px;
                        margin-top: 6px;
                    }
                    .right_ul {
                        height: 274px;
                        width: 338px;
                        overflow-y: scroll;
                        .list_department,
                        .list_department_checked {
                            overflow: hidden;
                            padding: 10px;
                            height: 34px;
                            color: #333333;
                            font-size: 13px;
                            border-radius: 2px;
                            border: solid 1px #a3b8cc;
                            display: inline-flex;
                            margin-bottom: 12px;
                            margin-right: 10px;
                            align-items: center;
                            position: relative;
                            cursor: pointer;
                            .department_delete {
                                position: absolute;
                                position: absolute;
                                right: -8px;
                                top: -8px;
                                width: 16px;
                                height: 16px;
                                background-color: #0c7ff5;
                            }
                        }
                        .list_department_checked {
                            color: white;
                            border: none;
                            background-color: #0c7ff5;
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
                .modal_last {
                    float: left;
                    margin-left: 0px;
                }
            }
        }
    }

    .detail_modal {
        .ivu-modal {
            width: 704px !important;
            top: 290px !important;
            .ivu-modal-content {
                width: 704px;
                height: 450px;
                padding-bottom: 8px;
                .ivu-modal-close {
                    top: 14px;
                    right: 14px;
                }
                .ivu-modal-body {
                    padding: 0 20px 0 30px;
                    overflow: hidden;
                    .modal_container {
                        // display: flex;
                        margin-top: 44px;
                        // justify-content: center;
                        .modal_user {
                            display: flex;
                            align-items: center;
                            margin-bottom: 24px;
                            justify-content: center;
                            .user_icon {
                                width: 58px;
                                height: 58px;
                                border-radius: 50%;
                                margin-right: 20px;
                                background-color: #999999;
                            }
                            .user_department_content {
                                display: flex;
                                flex-direction: column;
                                .user_name {
                                    color: #333333;
                                    font-size: 18px;
                                    line-height: 18px;
                                }
                                .user_dep {
                                    color: #999999;
                                    font-size: 18px;
                                    line-height: 18px;
                                    margin-top: 8px;
                                }
                            }
                        }
                        .user_info {
                            display: flex;
                            color: #999;
                            font-size: 13px;
                            line-height: 13px;
                            justify-content: center;
                            margin-bottom: 28px;
                            .form_title {
                                width: 66px;
                                text-align: right;
                                color: #999999;
                                font-size: 13px;
                            }
                            .info_phone {
                                width: 220px;
                                margin-left: 6px;
                                span {
                                    color: #333333;
                                    margin-right: 28px;
                                }
                            }
                        }
                        .user_form {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 20px;
                            .form_title {
                                width: 66px;
                                text-align: right;
                                color: #999999;
                                font-size: 13px;
                            }
                            .form_input {
                                width: 220px;
                                height: 34px;
                                background-color: #ffffff;
                                border-radius: 2px;
                                border: solid 1px #a3b8cc;
                                text-indent: 6px;
                                margin-left: 6px;
                                color: #333333;
                            }
                        }
                    }
                }
                .ivu-modal-footer {
                    border: none;
                    padding: 0 20px 0 0;
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
                        .modal_last {
                            float: left;
                            margin-left: 0px;
                        }
                    }
                }
            }
        }
    }

    .department {
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
                padding: 26px 0;
                min-height: 845px;
                overflow: hidden;
                box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
                border-radius: 10px;
                // display: flex;
                // flex-direction: column;
                // justify-content: space-between;
                .check_table_inline {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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
                    }
                    .form_r {
                        float: right;
                        display: flex;
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
                            margin-left: 20px;
                            float: right;
                            cursor: pointer;
                        }
                    }
                }
                .panel_box {
                    display: flex;
                    justify-content: space-between;
                    padding: 16px 30px 0 30px;
                    margin-top: 25px;
                    border-top: 1px solid #eeeeee;
                    flex-wrap: wrap;
                    .list {
                        width: 340px;
                        transition: height .3s;
                        margin-bottom: 30px;
                        box-shadow: 0px 2px 10px 0px rgba(0, 24, 148, 0.3);
                        border-radius: 4px;
                        .panel_head {
                            width: 340px;
                            height: 60px;
                            background-color: #ffffff;
                            padding: 0 20px;
                            display: flex;
                            overflow: hidden;
                            cursor: pointer;
                            align-items: center;
                            justify-content: space-between;
                            .head_title {
                                color: #333333;
                                font-size: 16px;
                            }
                            .head_r {
                                .head_number {
                                    color: #999999;
                                    font-size: 16px;
                                    position: relative;
                                    margin-right: 16px;
                                    &::after {
                                        content: "";
                                        position: absolute;
                                        top: 6px;
                                        right: -16px;
                                        width: 0;
                                        height: 0;
                                        border-left: 4px solid transparent;
                                        border-right: 4px solid transparent;
                                        border-top: 5px solid #333333;
                                        transform: rotate(0deg);
                                        transition: transform 0.2s ease-in-out,
                                        -webkit-transform 0.2s ease-in-out;
                                    }
                                }
                                .head_number_selected {
                                    color: #999999;
                                    font-size: 16px;
                                    position: relative;
                                    margin-right: 16px;
                                    &::after {
                                        content: "";
                                        position: absolute;
                                        top: 6px;
                                        right: -16px;
                                        width: 0;
                                        height: 0;
                                        border-left: 4px solid transparent;
                                        border-right: 4px solid transparent;
                                        border-top: 5px solid #333333;
                                        transform: rotate(-180deg);
                                        transition: transform 0.2s ease-in-out,
                                        -webkit-transform 0.2s ease-in-out;
                                    }
                                }
                                .head_rename,
                                .head_remote {
                                    color: #0c7ff5;
                                    font-size: 13px;
                                    cursor: pointer;
                                }
                                .el_tree_delete {
                                    .list_quit {
                                        color: #0c7ff5;
                                        font-size: 13px;
                                        margin-left: 12px;
                                        border: none;
                                        padding: 0;
                                    }
                                }
                                .head_remote {
                                    margin-left: 14px;
                                }
                            }
                        }
                        .panel_content,
                        .panel_content_selected {
                            display: none;
                            overflow: hidden;
                            transition: display 0.2s ease-in-out,
                            -webkit-transform 0.2s ease-in-out;
                            padding: 0 20px;
                            border-top: 1px solid #eeeeee;
                            .content_list {
                                display: flex;
                                align-items: center;
                                height: 34px;
                                .list_name {
                                    color: #0c7ff5;
                                    font-size: 13px;
                                    cursor: pointer;
                                }
                                .list_phone {
                                    color: #333333;
                                    font-size: 13px;
                                    margin-left: 50px;
                                    margin-right: 40px;
                                }
                                .list_transfer {
                                    color: #0c7ff5;
                                    font-size: 13px;
                                    margin-right: 15px;
                                    cursor: pointer;
                                }
                                .list_quit {
                                    color: #0c7ff5;
                                    font-size: 13px;
                                    margin-left: 15px;
                                    border: none;
                                    padding: 0;
                                }
                            }
                        }
                        .panel_content_selected {
                            display: inline-block;
                            transition: height 0.2s ease-in-out, -webkit-height 0.2s ease-in-out;
                        }
                        .child_department {
                            display: flex;
                            flex-direction: column;
                            transition: display 0.2s ease-in-out,
                            -webkit-display 0.2s ease-in-out;
                            padding-bottom: 10px;
                            .el-tree {
                                .el-tree-node__content {
                                    display: flex;
                                    flex-direction: row-reverse;
                                    justify-content: flex-end;
                                    margin-left: 21px;
                                    align-items: center;
                                    position: relative;
                                    .custom-tree-node {
                                        color: #0c7ff5;
                                        font-size: 13px;
                                        .el_tree_operate {
                                            position: absolute;
                                            right: 20px;
                                            top: 5px;
                                        }
                                    }
                                    .el-tree-node__expand-icon {
                                        color: #0c7ff5;
                                    }
                                    .el-tree-node__expand-icon.is-leaf {
                                        color: transparent;
                                    }
                                }
                                .el-tree-node__children {
                                    &:last-child {
                                        .el_tree_operate {
                                            // display: none;
                                        }
                                    }
                                }
                            }
                            .custom_tree_node {
                                display: flex;
                                height: 26px;
                                margin: 0 21px;
                                align-items: center;
                                position: relative;
                                justify-content: space-between;
                                .el_tree_dep {
                                    cursor: pointer;
                                    color: #0c7ff5;
                                    font-size: 13px;
                                }
                                .el_tree_number {
                                    cursor: pointer;
                                    color: #0c7ff5;
                                    font-size: 13px;
                                }
                                .el_tree_delete {
                                    .list_quit {
                                        color: #0c7ff5;
                                        font-size: 13px;
                                        margin-left: 12px;
                                        border: none;
                                        padding: 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @import "../../../assets/css/common.css";

</style>
