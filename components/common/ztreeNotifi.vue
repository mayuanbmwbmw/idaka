<template>
    <!--<div :class="{'empty': isempty}">-->
    <div class="treeForNoti">
        <div class="addParent" v-if="edit">
            <button @click="addParent">新增分组</button>
        </div>

        <ul :id="randomId" class="ztree"></ul>

        <!-- modal 员工详情 -->
        <no-ssr>
            <Modal class="detail_modal" v-model="detail_modal" width="360" :mask="true">
                <div class="modal_container">
                    <div class="modal_user">
                        <img :src="avatar" alt="" class="user_icon">
                        <p class="user_department_content">
                            <span class="user_name">{{detailName}}</span>
                            <span class="user_dep">{{detailDep}}</span>
                        </p>
                    </div>

                    <div class="user_info">
                        <span class="form_title">
                            <!--<span>性别：男</span>-->
                            <span>电话：</span>
                        </span>
                        <p class="info_phone">
                            <span>{{editForm.phone}}</span>
                        </p>
                    </div>
                    <p class="user_form">
                        <span class="form_title">内部电话：</span>
                        <el-input :disabled="!edit" v-model="editForm.tele" style="width: 220px"
                                  placeholder="请输入内容"></el-input>
                    </p>
                    <p class="user_form">
                        <span class="form_title">公司邮箱：</span>
                        <el-input :disabled="!edit" v-model="editForm.mail" style="width: 220px"
                                  placeholder="请输入内容"></el-input>
                    </p>
                    <p class="user_form">
                        <span class="form_title">工号：</span>
                        <el-input :disabled="!edit" v-model="editForm.code" style="width: 220px"
                                  placeholder="请输入内容"></el-input>
                    </p>
                    <p class="user_form">
                        <span class="form_title">入职日期：</span>
                        <el-date-picker
                                :disabled="!edit"
                                v-model="editForm.date"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </p>

                </div>
                <div class="modal_footer" slot="footer">
                    <span class="modal_allow" @click="onConfirm">确认</span>
                    <span class="modal_refuse" @click="onCancel">取消</span>
                </div>
            </Modal>
        </no-ssr>
    </div>

</template>

<script>
  import axios from '~/plugins/axios'
  // import $ from 'jquery'

  // 文件
  import avatar from '~/static/img/user/avatar.png'

  export default {
    data () {
      return {
        // ztree
        zTreeObj: null,
        log: null,
        newCount: 1,
        randomId: '',

        // 编辑表单
        detail_modal: false,
        avatar: avatar,
        detailName: '',
        detailDep: '',
        editForm: {
          date: '',
          tele: '',
          code: '',
          mail: '',
          phone: ''
        },
        baseParams: {
          user_id: this.$store.state.login.userInfo.uid
          // enterprise_id: '1'
        },

        // setting: {
        //   view: {
        //     addHoverDom: this.addHoverDom,
        //     removeHoverDom: this.removeHoverDom,
        //     selectedMulti: false,
        //     showIcon: false
        //   },
        //   edit: {
        //     drag: {
        //       autoExpandTrigger: true,
        //       isCopy: true,
        //       isMove: true,
        //       prev: true,
        //       next: true,
        //       inner: true,
        //       borderMax: 10,
        //       borderMin: -5,
        //       minMoveSize: 5,
        //       maxShowNodeNum: 5,
        //       autoOpenTime: 500
        //     },
        //     enable: true,
        //     editNameSelectAll: true,
        //     // showRemoveBtn: this.showRemoveBtn,
        //     // showRenameBtn: this.showRenameBtn
        //     showRemoveBtn: true,
        //     showRenameBtn: true,
        //   },
        //   data: {
        //     simpleData: {
        //       enable: true
        //     }
        //   },
        //   callback: {
        //     beforeDrag: this.beforeDrag,
        //     beforeEditName: this.beforeEditName,
        //     beforeRemove: this.beforeRemove,
        //     beforeRename: this.beforeRename,
        //     onRemove: this.onRemove,
        //     onRename: this.onRename
        //   }
        // },
        setting: {
          view: {
            addHoverDom: this.addHoverDom,
            removeHoverDom: this.removeHoverDom,
            selectedMulti: false,
            addDiyDom: this.addDiyDom,
            // showLine: false,
            showIcon: false
            // fontCss: {fontSize: '15px'}
          },
          check: {
            enable: true
            // chkStyle: 'checkbox',
            // autoCheckTrigger: true,
          },
          edit: {
            enable: this.edit,
            editNameSelectAll: true,
            // showRemoveBtn: this.showRemoveBtn,
            // showRenameBtn: this.showRenameBtn,
            showRemoveBtn: true,
            showRenameBtn: true,
            removeTitle: '删除',
            renameTitle: '编辑'
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            beforeDrag: this.beforeDrag,
            beforeDrop: this.zTreeBeforeDrop,
            onDrag: this.zTreeOnDrag,
            beforeEditName: this.beforeEditName,
            beforeRemove: this.beforeRemove,
            beforeRename: this.beforeRename,
            onRemove: this.onRemove,
            onRename: this.onRename,
            onClick: this.zTreeOnClick,
            onDrop: this.zTreeOnDrop,
            onMouseUp: this.zTreeOnMouseUp,
            onExpand: this.zTreeOnExpand,
            onCheck: this.checkNodes
          }
        },
        className: 'dark',
        isempty: false
      }
    },
    props: {
      parentId: {
        default: ''
      },
      edit: {
        default: false
      },
      // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
      // setting: {
      //   default: function () {
      //     return {
      //       view: {
      //         addHoverDom: this.addHoverDom,
      //         removeHoverDom: this.removeHoverDom,
      //         selectedMulti: false,
      //         showIcon: false
      //       },
      //       edit: {
      //         enable: true,
      //         editNameSelectAll: true,
      //         // showRemoveBtn: this.showRemoveBtn,
      //         // showRenameBtn: this.showRenameBtn
      //         showRemoveBtn: true,
      //         showRenameBtn: true
      //       },
      //       data: {
      //         simpleData: {
      //           enable: true
      //         }
      //       },
      //       callback: {
      //         beforeDrag: this.beforeDrag,
      //         beforeEditName: this.beforeEditName,
      //         beforeRemove: this.beforeRemove,
      //         beforeRename: this.beforeRename,
      //         onRemove: this.onRemove,
      //         onRename: this.onRename
      //       }
      //     }
      //   }
      // },
      // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
      zNodes: {
        default: () => [
          // {id: 1, pId: 0, name: '前端开发部'},
          // {id: 11, pId: 1, name: '前端开发一组'},
          // {id: 111, pId: 11, name: '王大锤'},
          // {id: 112, pId: 11, name: '王大锤'},
          // {id: 113, pId: 11, name: '王大锤'},
          // {id: 12, pId: 1, name: '前端开发二组'},
          // {id: 13, pId: 1, name: '前端开发三组'},
          // {id: 2, pId: 0, name: '父节点 2'},
          // {id: 21, pId: 2, name: '叶子节点 2-1'},
          // {id: 22, pId: 2, name: '叶子节点 2-2'},
          // {id: 23, pId: 2, name: '叶子节点 2-3'},
          // {id: 3, pId: 0, name: '父节点 3'},
          // {id: 31, pId: 3, name: '叶子节点 3-1'},
          // {id: 32, pId: 3, name: '叶子节点 3-2'},
          // {id: 33, pId: 3, name: '叶子节点 3-3'}
        ]
      }
      // className: {
      //   default: 'dark'
      // },
    },
    components: {},
    beforeCreate () {
    },
    mounted () {
      const that = this
      this.randomId = 'tree' + Math.random().toString(36).substr(2)
      setTimeout(function () {
        that.zTreeObj = $.fn.zTree.init($('#' + that.randomId), that.setting, that.zNodes)
        // console.log($.fn.zTree.getZTreeObj(that.randomId))
        // console.log(that.zTreeObj)
        that.zTreeObj.diyId = that.parentId
        // console.log( that.zTreeObj.diyId)

        that.chenkLength(that.randomId)
      }, 100)
    },
    methods: {

      // 员工转移 ok
      async employee_changedepartment (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/employee_changedepartment', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 员工离职 ok
      async employee_delete (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/employee_delete', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 添加部门-提交添加结果 未在添加在传入的父元素id下
      async newdepartment_add (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/newdepartment_add', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.newdepartment_id)
        } else {
          return Promise.reject(data.msg)
        }
      },
      // 添加部门-获取人员信息 没有性别字段，不能修改
      async employee_info (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/employee_info', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 部门重命名 ok
      async department_rename (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/department_rename', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },
      // 部门移除 ok
      async editDepartment (obj) {
        let dailysign = await axios.get('/pcapi/employee_manage/department_delete', {
          params: Object.assign(obj || {}, this.baseParams)
        })
        const {data} = dailysign
        if (data.code === 0) {
          return Promise.resolve(data.data)
        }
      },

      // beforeDrag (treeId, treeNodes) {
      //   // return false
      // },
      // beforeEditName (treeId, treeNode) {
      //   this.className = (this.className === 'dark' ? '' : 'dark')
      //   this.showLog('[ ' + this.getTime() + ' beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name)
      //   let zTree = $.fn.zTree.getZTreeObj(this.randomId)
      //   // let zTree = this.zTreeObj
      //   zTree.selectNode(treeNode)
      //   setTimeout(function () {
      //     if (confirm('进入节点 -- ' + treeNode.name + ' 的编辑状态吗？')) {
      //       setTimeout(function () {
      //         zTree.editName(treeNode)
      //       }, 0)
      //     }
      //   }, 0)
      //   return false
      // },
      // beforeRemove (treeId, treeNode) {
      //   this.className = (this.className === 'dark' ? '' : 'dark')
      //   this.showLog('[ ' + this.getTime() + ' beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name)
      //   let zTree = $.fn.zTree.getZTreeObj(this.randomId)
      //   // let zTree = this.zTreeObj
      //   zTree.selectNode(treeNode)
      //   return confirm('确认删除 节点 -- ' + treeNode.name + ' 吗？')
      // },
      // onRemove (e, treeId, treeNode) {
      //   this.showLog('[ ' + this.getTime() + ' onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name)
      // },
      // beforeRename (treeId, treeNode, newName, isCancel) {
      //   const that = this
      //   this.className = (this.className === 'dark' ? '' : 'dark')
      //   this.showLog((isCancel ? "<span style='color:red'>" : '') + '[ ' + this.getTime() + ' beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name + (isCancel ? '</span>' : ''))
      //   if (newName.length === 0) {
      //     setTimeout(function () {
      //       let zTree = $.fn.zTree.getZTreeObj(that.randomId)
      //       // let zTree = that.zTreeObj
      //       zTree.cancelEditName()
      //       alert('节点名称不能为空.')
      //     }, 0)
      //     return false
      //   }
      //   return true
      // },
      // onRename (e, treeId, treeNode, isCancel) {
      //   this.showLog((isCancel ? "<span style='color:red'>" : '') + '[ ' + this.getTime() + ' onRename ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name + (isCancel ? '</span>' : ''))
      // },
      // showRemoveBtn (treeId, treeNode) {
      //   console.log(treeNode)
      //   return !treeNode.isFirstNode
      // },
      // showRenameBtn (treeId, treeNode) {
      //   return !treeNode.isLastNode
      // },
      // showLog (str) {
      //   if (!this.log) this.log = $('#log')
      //   this.log.append("<li class='" + this.className + "'>" + str + '</li>')
      //   if (this.log.children('li').length > 8) {
      //     this.log.get(0).removeChild(this.log.children('li')[0])
      //   }
      // },
      // getTime () {
      //   let now = new Date(),
      //     h = now.getHours(),
      //     m = now.getMinutes(),
      //     s = now.getSeconds(),
      //     ms = now.getMilliseconds()
      //   return (h + ':' + m + ':' + s + ' ' + ms)
      // },
      //
      // 添加一级父节点
      addParent () {
        const that = this
        let zTree = $.fn.zTree.getZTreeObj(that.randomId),
          isParent = true,
          nodes = zTree.getSelectedNodes(),
          treeNode = nodes[0]
        this.$prompt('请输入分组名称', '新增分组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: '新增分组',
          inputValidator: function (value) {
            if (!value) {
              return '分组名称不能为空'
            }
            if (!(/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/).test(value)) {
              return '分组名称不能超过20个字符'
            }
          }
          // inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/,
          // inputErrorMessage: '部门名称不能为空或者不能超过20个字符'
        }).then((value) => {
          let val = value.value

          // 发请求
          that.newdepartment_add({
            user_id: that.$store.state.login.userInfo.uid,
            department_name: val,
            department_employee: '',
            department_parent: that.parentId
          }).then(res => {
            if (treeNode) {
              treeNode = zTree.addNodes(treeNode, {
                id: res,
                department_id: res,
                pId: treeNode.id,
                isParent: isParent,
                name: val
              })
            } else {
              treeNode = zTree.addNodes(null, {
                id: res,
                department_id: res,
                pId: that.parentId,
                isParent: isParent,
                name: val
              })
            }
            $('#' + treeNode.tId + '_span').html(val)
            that.chenkLength(that.randomId)
          })
        })

        // if (treeNode) {
        //   treeNode = zTree.addNodes(treeNode, {
        //     id: (100 + that.newCount),
        //     pId: treeNode.id,
        //     isParent: isParent,
        //     name: '新建分组' + (that.newCount++)
        //   })
        // } else {
        //   treeNode = zTree.addNodes(null, {
        //     id: (100 + that.newCount),
        //     pId: 0,
        //     isParent: isParent,
        //     name: '新建分组' + (that.newCount++)
        //   })
        // }
        // if (treeNode) {
        //   zTree.editName(treeNode[0])
        // } else {
        //   alert('叶子节点被锁定，无法增加子节点')
        // }
      },
      // addHoverDom (treeId, treeNode) {
      //   const that = this
      //   let sObj = $('#' + treeNode.tId + '_span')
      //   if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0) return
      //   let addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
      //     "' title='add node' onfocus='this.blur();'></span>"
      //   sObj.after(addStr)
      //   let btn = $('#addBtn_' + treeNode.tId)
      //   if (btn) {
      //     btn.bind('click', function () {
      //       let zTree = $.fn.zTree.getZTreeObj(that.randomId)
      //       // let zTree = that.zTreeObj
      //       zTree.addNodes(treeNode, {id: (100 + that.newCount), pId: treeNode.id, name: 'new node' + (that.newCount++)})
      //       return false
      //     })
      //   }
      // },
      // removeHoverDom (treeId, treeNode) {
      //   $('#addBtn_' + treeNode.tId).unbind().remove()
      // },
      // selectAll () {
      //   let zTree = $.fn.zTree.getZTreeObj(this.randomId)
      //   // let zTree = this.zTreeObj
      //   zTree.setting.edit.editNameSelectAll = $('#selectAll').attr('checked')
      // },

      getLeafDepartment (treeNode) {
        const _this = this
        queryChildDepartment(treeNode.id).then(response => {
          console.log('ok')
          let treeObj = $.fn.zTree.getZTreeObj(_this.randomId)
          treeObj.addNodes(treeNode, response.value)
        })
      },
      jsEditSure (treeNode) {
        this.isEditShow = false
        let val = $('#groupTitle span.title').html()
        let params = {
          'enterpriseId': this.companyId,
          'departmentId': treeNode.id,
          'departmentName': val
        }
        update(params).then(response => {
          $('#' + treeNode.tId + '_span').html(val)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        })
      },
      jsEditCancel () {
        this.isEditShow = false
        this.$message({
          type: 'info',
          message: '取消修改！'
        })
      },
      jsEditName () {
        this.isEditShow = true
      },
      // 改变每页显示数量
      // handleSizeChange() {
      // },
      // 改变页码
      // handleCurrentChange(val) {
      //   this.group_current_page = val;
      //   if(this.isNowTreeNode === this.treeCompanyId){
      //     this.isNowTreeNode = '';
      //   }
      //   this.queryDepartment(this.isNowTreeNode)
      // },
      // 详情
      queryDepartment (id) {
        const _this = this
        this.detail_modal = true
        // 获取员工详情
        _this.employee_info({
          user_id: _this.$store.state.login.userInfo.uid,
          employee_id: id
        }).then(res => {
          _this.detailName = res.name
          _this.detailDep = res.enterprise
          _this.editForm.phone = res.phone
          _this.editForm.date = res.entry_date
          _this.editForm.tele = res.work_phone
          _this.editForm.code = res.work_number
          _this.editForm.mail = res.email
        })

        // let params = {}
        // params = {
        //   pageNum: this.group_current_page,
        //   rowsNum: this.group_page_size
        // }
        // if (departmentId && departmentId !== this.treeCompanyId) {
        //   params.departmentId = departmentId
        //   queryDepartmentInfo(params).then(response => {
        //     this.tableData = response.value.userResultVo.list
        //     this.groupTotal = response.value.userResultVo.maxRows
        //   })
        // } else {
        //   params.companyId = this.companyId
        //   getQueryCompanyInfo(params).then(response => {
        //     this.tableData = response.value.userResultVo.list
        //     this.groupTotal = response.value.userResultVo.maxRows
        //   })
        // }
      },
      // preview: function() {
      //   this.$router.push('/admin/user/preview')
      // },
      // 自定义操作按钮
      addDiyDom: function (treeId, treeNode) {
        let aObj = $('#' + treeNode.tId + '_span')
        if ($('#' + treeNode.tId + '_count').length > 0) return
        let editStr
        if (treeNode.employee_id) {
          editStr = '<span class="customztreeicon employee"></span>'
        } else {
          editStr = '<span class="customztreeicon group"></span>'
        }
        aObj.before(editStr)
      },
      // 拖拽之前
      beforeDrag: function (treeId, treeNodes) {
        // 根节点和禁止拖拽的节点不能拖拽
        // for (let i = 0; i < treeNodes.length; i++) {
        //   if (treeNodes[i].drag == false || !treeNodes[i].getParentNode()) {
        //     return false
        //   }
        // }

        // 部门分组不能移动
        if (treeNodes[0].employee_id) {
          return true
        } else {
          this.$message({
            type: 'warning',
            message: '分组不支持移动!'
          })
          return false
        }
      },
      // 拖拽落地
      zTreeBeforeDrop: function (treeId, treeNodes, targetNode, moveType) {
        // treeNodes 当前拖拽选中的节点 targetNode是最后放入的位置节点信息
        // if (targetNode.level === 0) {
        //   return false
        // }
        // this.minusAcount(treeNodes[0], treeNodes[0].userAmount)
        const _this = this
        // console.log(treeId)
        // console.log(targetNode)
        // console.log(treeNodes[0])

        let zTree, parentTree
        let moveIndex = -1

        if (treeId) {
          // 落地在tree对象里
          zTree = $.fn.zTree.getZTreeObj(_this.randomId)
          parentTree = $.fn.zTree.getZTreeObj(treeId)
          // console.log('parentTree', parentTree)

          if (targetNode) {
            // 确定落地位置
            if (targetNode.level !== 0) {
              // 落在内层节点
              if (moveType === 'prev') {
                targetNode = targetNode.getParentNode()
                moveIndex = targetNode.getIndex() > 0 ? targetNode.getIndex() - 1 : 0
              } else if (moveType === 'next') {
                targetNode = targetNode.getParentNode()
                moveIndex = targetNode.getIndex()
              }
            } else {
              // 落在最外层节点
              if (moveType !== 'inner') {
                if (moveType === 'prev') {
                  moveIndex = targetNode.getIndex() > 0 ? targetNode.getIndex() - 1 : 0
                } else if (moveType === 'next') {
                  moveIndex = targetNode.getIndex()
                }
                targetNode = null
              }
            }
          } else {
            // 落地在 tree 中其他位置
            moveIndex = -1
          }
        } else {
          return false
        }

        // console.log(treeNodes, targetNode, moveType)

        // 不能移动至员工里
        if (targetNode && targetNode.employee_id) {
          _this.$message({
            type: 'warning',
            message: '不能移动至员工当中!'
          })
        } else {
          _this.$confirm('确认移动?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // let params = {
            //   'departmentId': treeNodes[0].id,
            //   'toDepartmentId': targetNode.id
            // }
            // if (moveType === 'prev' || moveType === 'next') {
            //   console.log(targetNode.getParentNode())
            //   params.toDepartmentId = targetNode.getParentNode().id
            //   params.isFirstLevel = targetNode.getParentNode().level === 0 ? 1 : 0
            // } else {
            //   params.isFirstLevel = targetNode.level === 0 ? 1 : 0
            // }

            // 发请求
            _this.employee_changedepartment({
              user_id: _this.$store.state.login.userInfo.uid,
              employee_id: treeNodes[0].employee_id,
              // department_id: targetNode ? targetNode.department_id : _this.parentId
              department_id: targetNode ? targetNode.department_id : parentTree.diyId
            }).then(res => {
              // zTree.moveNode(targetNode, treeNodes[0], moveType)
              // parentTree.moveNode(targetNode, treeNodes[0], moveType)
              // zTree.expandNode(targetNode, true, true, true)
              zTree.removeNode(treeNodes[0])
              parentTree.addNodes(targetNode, moveIndex, treeNodes[0])

              // if (moveType === 'inner') {
              //   this.plusAccount(targetNode, treeNodes[0].userAmount)
              // }
              _this.$message({type: 'success', message: '移动成功!'})
              _this.chenkLength(treeId)
              _this.chenkLength(_this.randomId)
              return true
            })

            // updateDepartmentLevel(params).then(response => {
            //   flag = true
            //   zTree.moveNode(targetNode, treeNodes[0], moveType)
            //   zTree.expandNode(targetNode, true, true, true)
            //   if (moveType === 'inner') {
            //     this.plusAccount(targetNode, treeNodes[0].userAmount)
            //   }
            //   this.$message({
            //     type: 'success',
            //     message: '移动成功!'
            //   })
            // })
          }).catch(() => {
            // zTree.moveNode(treeNodes[0], targetNode, moveType)
            _this.$message({
              type: 'info',
              message: '取消移动！'
            })
            return false
            // if (moveType) {
            //   this.plusAccount(treeNodes[0].getParentNode(), treeNodes[0].userAmount)
            // }
          })
        }
        return false
      },
      // 点击节点
      zTreeOnClick: function (event, treeId, treeNode) {
        // 员工can可查看详情
        // if (treeNode.employee_id) {
        //   this.isIconShow = false
        //   this.isEditFlag = true
        //   // this.choosedNode = treeNode
        //   // this.isNowTreeNode = treeNode.id
        //   // this.group_current_page = 1
        //   // this.isComDep = treeNode.level === 0 ? '公司' : '部门'
        //   // this.isIconShow = treeNode.level === 0
        //   this.queryDepartment(treeNode.employee_id)
        // }

        // let zTree = $.fn.zTree.getZTreeObj(treeId)
        // zTree.checkNode(treeNode)
        // this.$emit('getSelectedNodes', zTree.getCheckedNodes())
        // console.log(`${treeNode.tId}_check`)
        $(`#${treeNode.tId}_check`).trigger('click')
      },
      // 编辑
      beforeEditName: function (treeId, treeNode) {
        let _this = this
        // 员工不能更改名字
        if (!treeNode.employee_id) {
          this.$prompt('请编辑部门名称', '修改', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: treeNode.name,
            inputValidator: function (value) {
              if (!value) {
                return '部门名称不能为空'
              }
              if (!(/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/).test(value)) {
                return '部门名称不能超过20个字符'
              }
            }
            // inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/,
            // inputErrorMessage: '部门名称不能为空或者不能超过20个字符'
          }).then((value) => {
            let val = value.value

            // let params = {
            //   'enterpriseId': _this.companyId,
            //   'departmentId': treeNode.id,
            //   'departmentName': val
            // }
            // update(params).then(response => {
            //   $('#' + treeNode.tId + '_span').html(val)
            //   $('#groupTitle span.title').html(val)
            //   this.choosedNode = treeNode
            //   this.$message({
            //     type: 'success',
            //     message: '修改成功'
            //   })
            // })

            // 发请求
            // console.log(treeNode)
            _this.department_rename({
              user_id: _this.$store.state.login.userInfo.uid,
              new_department_name: val,
              department_id: treeNode.department_id
            }).then(res => {
              // _this.departmentData[index].name = val
              // for (let i = 0; i < _this.departmentData.length; i++) {
              //   if (_this.departmentData[i].id === index.id) {
              //     _this.departmentData[i].name = val
              //   }
              // }
              $('#' + treeNode.tId + '_span').html(val)
            })
          }).catch(() => {
            // this.$message({
            // type: 'info',
            // message: '取消修改'
            // });
          })
        } else {
          this.$message({
            type: 'warning',
            message: '员工不可修改名称!'
          })
        }
        return false
      },
      // 删除
      beforeRemove: function (treeId, treeNode) {
        const _this = this
        let zTree = $.fn.zTree.getZTreeObj(this.randomId)
        let flag = false
        // 删除部门
        if (!treeNode.employee_id) {
          this.$confirm('确认删除部门?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let id = treeNode.id

            // 删除部门
            _this.editDepartment({
              user_id: _this.$store.state.login.userInfo.uid,
              department_id: treeNode.department_id
            }).then(res => {
              flag = true
              zTree.removeChildNodes(treeNode)
              zTree.removeNode(treeNode)

              this.$message({type: 'success', message: '删除部门成功!'})
              _this.chenkLength(_this.randomId)
            })

            // deleteDepartment(id).then(response => {
            //   flag = true
            //   zTree.removeChildNodes(treeNode)
            //   zTree.removeNode(treeNode)
            //   if (response.value) {
            //     let treeNodeRoot = zTree.getNodesByFilter(this.filter, true) // 仅查找一个节点
            //     zTree.addNodes(treeNodeRoot, {
            //       name: '其他部门',
            //       userAmount: response.value.userAmount,
            //       drag: false,
            //       isOther: 1
            //     })
            //     this.minusAcount(treeNode, response.value.userAmount)
            //   } else {
            //     if (!treeNode.userAmount) {
            //       return false
            //     }
            //     this.minusAcount(treeNode, treeNode.userAmount)
            //     let treeNodeOther = zTree.getNodesByFilter(this.filterOther, true)
            //     let otherNum = treeNodeOther.userAmount + treeNode.userAmount
            //     treeNodeOther.userAmount = otherNum
            //     $('#' + treeNodeOther.tId + '_count').html('(' + otherNum + '人)')
            //   }
            //
            //   this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            //   })
            // })
          }).catch(() => {
            // flag = false
            // this.$message({

            //     type: 'info',
            //     message: '取消删除！'
            // });
          })
        } else {
          // 删除人员
          this.$confirm('确认该人员已离职?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let id = treeNode.id

            // 删除人员
            _this.employee_delete({
              user_id: _this.$store.state.login.userInfo.uid,
              employee_id: treeNode.employee_id
            }).then(res => {
              flag = true
              zTree.removeChildNodes(treeNode)
              zTree.removeNode(treeNode)

              this.$message({type: 'success', message: '人员离职成功!'})
              _this.chenkLength(_this.randomId)
            })
          }).catch(() => {
          })
        }
        return flag
      },
      plusAccount: function (treeNode, userAmount) {
        treeNode.userAmount = treeNode.userAmount + userAmount
        $('#' + treeNode.tId + '_count').html('(' + treeNode.userAmount + '人)')
        if (treeNode.level === 1) {
          return false
        }
        return this.plusAccount(treeNode, userAmount)
      },
      minusAcount: function (treeNode, userAmount) {
        let nodes = treeNode.getParentNode()
        if (!nodes.parentTId) {
          return false
        }
        nodes.userAmount = nodes.userAmount - userAmount
        $('#' + nodes.tId + '_count').html('(' + nodes.userAmount + '人)')
        return this.minusAcount(nodes, userAmount)
      },
      showRemoveBtn: function (treeId, treeNode) {
        let removeFlag = !treeNode.isOther && treeNode.level
        return removeFlag
      },
      showRenameBtn: function (treeId, treeNode) {
        let removeFlag = !treeNode.isOther && treeNode.level
        return removeFlag
      },

      // hover节点 添加
      addHoverDom: function (treeId, treeNode) {
        const _this = this
        // 员工下方不能新增
        if (!treeNode.employee_id && _this.edit) {
          let sObj = $('#' + treeNode.tId + '_span')
          if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0) return
          let addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
            "' title='新增分组' onfocus='this.blur();'></span>"
          sObj.after(addStr)
          let btn = $('#addBtn_' + treeNode.tId)
          if (btn) {
            btn.bind('click', function () {
              // 动态添加数据
              let msg = '您将在' + treeNode.name + '下新增分组'
              _this.$prompt(msg, '新增分组', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                // inputValue: '',
                inputPlaceholder: '请输入',
                // inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/,
                inputValidator: function (value) {
                  if (!value) {
                    return '分组名称不能为空'
                  }
                  if (!(/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/).test(value)) {
                    return '分组名称不能超过20个字符'
                  }
                }
                // inputErrorMessage: '部门名称不能为空'
              }).then((value) => {
                let val = value.value
                let zTree = $.fn.zTree.getZTreeObj(_this.randomId)
                // let params = {
                //   'companyId': _this.companyId,
                //   'departmentPId': treeNode.id || -2,
                //   'departmentName': val
                // }
                // params.isFirstLevel = treeNode.level == 0 ? 1 : 0
                // addDepartment(params).then(response => {
                //   _this.isNowAdd = true
                //   zTree.addNodes(treeNode, {id: response.value.departmentId, name: val, userAmount: 0})
                //   _this.$message({
                //     type: 'success',
                //     message: '添加成功'
                //   })
                // })
                // console.log(treeNode)

                _this.newdepartment_add({
                  user_id: _this.$store.state.login.userInfo.uid,
                  department_name: val,
                  department_employee: '',
                  // department_parent: treeNode.pId
                  department_parent: treeNode.department_id
                }).then(res => {
                  zTree.addNodes(treeNode, {id: res, department_id: res, name: val, userAmount: 0})
                  _this.$message({type: 'success', message: '添加成功'})
                  _this.chenkLength(_this.randomId)
                }).catch(res => {
                  _this.$message.error(res)
                })
              }).catch(() => {
                // _this.$message({
                // type: 'info',
                // message: '取消添加'
                // });
              })
              return false
            })
          } else {
            _this.$message({
              type: 'warning',
              message: '员工下方不能新增节点!'
            })
          }
        } else {
          // 员工不显示编辑按钮
          let sObj = $('#' + treeNode.tId + '_span')
          sObj.parent().find('.button.edit').hide()
        }
      },
      removeHoverDom: function (treeId, treeNode) {
        $('#addBtn_' + treeNode.tId).parents('a').removeClass('curSelectedNode')
        $('#addBtn_' + treeNode.tId).unbind().remove()
      },
      filter: function (node) {
        return (node.level === 0)
      },
      filterOther: function (node) {
        return (node.isOther === 1)
      },
      // rightIsEdit: function () {
      //   let _this = this
      //   $('#groupTitle span.edit').click(function (e) {
      //     // let id = e.currentTarget.id
      //     let name = $('#groupTitle span.title').html()
      //     let tId = $(this).attr('data-tId')
      //     _this.$prompt('请编辑部门名称', '修改部门', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       inputValue: name,
      //       inputValidator: function (value) {
      //         if (!value) {
      //           return '部门名称不能为空'
      //         }
      //         if (!(/^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/).test(value)) {
      //           return '部门名称不能超过20个字符'
      //         }
      //       }
      //       // inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/,
      //       // inputErrorMessage: '部门名称不能为空或者不能超过20个字符'
      //     }).then((value) => {
      //       let val = value.value
      //       $('#' + tId + '_span').html(val)
      //       $('.groupEdit span.title').html(val)
      //       _this.$message({
      //         type: 'success',
      //         message: '修改成功'
      //       })
      //     }).catch(() => {
      //       _this.$message({
      //         type: 'info',
      //         message: '取消修改'
      //       })
      //     })
      //     return false
      //   })
      // },
      // getCompanyInfo: function () {
      //   const _this = this
      //   let params = {
      //     pageNum: _this.group_current_page,
      //     rowsNum: _this.group_page_size,
      //     companyId: _this.companyId
      //   }
      //   getQueryCompanyInfo(params).then(response => {
      //     _this.zTreeNodes = response.value.departmentList
      //     _this.tableData = response.value.userResultVo.list
      //     _this.groupTotal = response.value.userResultVo.maxRows
      //     $.fn.zTree.init($('#tree'), _this.setting, _this.zTreeNodes)
      //     let treeObj = $.fn.zTree.getZTreeObj(_this.randomId)
      //     let treeNode = treeObj.getNodesByFilter(this.filter, true) // 仅查找一个节点
      //     this.choosedNode = treeNode
      //     // this.rightIsEdit()
      //   })
      // },

      onConfirm () {
        this.detail_modal = false
      },
      onCancel () {
        this.detail_modal = false
      },

      chenkLength (id) {
        // console.log($('#' + id).text())
        let con = $('#' + id)
        if (con.text() === '') {
          con.parent().addClass('empty')
        } else {
          con.parent().removeClass('empty')
        }
        // this.isempty = ($('#' + id).text() === '')
        // console.log((zTree.getNodes().length === 0))
      },

      // checkbox
      checkNodes () {
        // const _this = this
        let zTree = $.fn.zTree.getZTreeObj(this.randomId)
        // console.log(zTree)
        // console.log(zTree.getSelectedNodes())
        this.$emit('getSelectedNodes', zTree.getCheckedNodes())
      },
      checkAll (a) {
        let zTree = $.fn.zTree.getZTreeObj(this.randomId)
        if (a) {
          zTree.checkAllNodes(true)
          this.$emit('getSelectedNodes', zTree.getCheckedNodes())
        } else {
          // zTree.cancelSelectedNode()
          zTree.checkAllNodes(false)
          this.$emit('getSelectedNodes', zTree.getCheckedNodes())
        }
      },

      // 搜索节点
      searchNodes (val) {
        // console.log(val)
        // 根据文本框的关键词输入情况自动匹配树内节点 进行模糊查找
        if (val.length > 0) {
          // InitialZtree();
          let zTree = $.fn.zTree.getZTreeObj(this.randomId)
          let nodeList = zTree.getNodesByParamFuzzy('name', val)
          // console.log('nodeList', nodeList)
          // 将找到的nodelist节点更新至Ztree内
          $.fn.zTree.init($(`#${this.randomId}`), this.setting, nodeList)
          // showMenu()
        } else {
          // 隐藏树
          // hideMenu();
          // InitialZtree()
          this.zTreeObj = $.fn.zTree.init($(`#${this.randomId}`), this.setting, this.zNodes)
        }
      }
    }
  }
</script>

<style lang="scss">
    .treeForNoti {
        .addParent {
            text-align: right;
        }

        .addParent > button {
            cursor: pointer;
            padding: 1px 5px;
        }

        .ztree {
            min-height: 50px;
            background-color: #fff;
            margin-top: 5px;
        }

        .ztree li span:hover {
            color: #0C7FF6;
        }

        .customztreeicon {
            display: inline-block;
            vertical-align: text-bottom;
            width: 20px;
            height: 20px;
        }

        .customztreeicon.employee {
            background: url("../../static/css/metroStyle/img/customicon.png") no-repeat -2px center;
        }

        .customztreeicon.group {
            background: url("../../static/css/metroStyle/img/customicon.png") no-repeat right center;
        }

        .ztree li span {
            font-size: 14px;
        }

        .empty .ztree:after {
            content: '(空)';
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 12px;
        }
        .ztree li a {
            cursor: default;
        }
    }


</style>