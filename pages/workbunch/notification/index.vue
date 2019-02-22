<template>
  <section class="notification">
    <navbar></navbar>
      <div class="check_main">
        <div class="breadcrumb">
          <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
          <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
          <no-ssr>
            <Breadcrumb separator=">">
              <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
              <BreadcrumbItem to="">发布通知</BreadcrumbItem>
            </Breadcrumb>
          </no-ssr>
        </div>
        <div class="check_table">
          <div class="table_form">
            <div class="table_addressee">
              <div class="addressee_operate">
                <span class="addressee_title">选择收件人</span>
                <span class="addressee_change" @click="allChange">{{ changeStatus }}</span>
              </div>
              <p class="change_number">
                已选：
                <span class="number">{{ staff.length }}个收件人</span>
                <!--<span class="number">{{ searchResult.split(',').length }}个收件人</span>-->
              </p>
              <div class="search_box">
                <input v-model="filterText" type="text" class="search" placeholder="请输入搜索关键字">
                <!-- <img src="" alt="" class="seach_icon"> -->
              </div>
              <p class="search_result" >
                <!-- :style="{opacity: searchResult.length > 0 ? 1 : 0}" -->
                已为您搜索出
                <span class="search_people">{{ searchResult }}</span>
                <!-- 及所在部门 -->
              </p>
              <!--tree-->
              <!--<el-tree-->
                <!--class="filter-tree"-->
                <!--show-checkbox-->
                <!--:data="staffList"-->
                <!--node-key="id"-->
                <!--:props="defaultProps"-->
                <!--:filter-node-method="filterNode"-->
                <!--:default-checked-keys="nodeKeys"-->
                <!--@check="onCheck"-->
                <!--ref="tree">-->
              <!--</el-tree>-->
              <div style="height: 580px;overflow-y: auto">
                <ztree :zNodes="departmentData" :edit="false" @getSelectedNodes="getSelectedNodes" ref="toTree"></ztree>
              </div>

            </div>
            <div class="table_sendmes">
                <p class="send_btn" @click="onSendEmail">
                  <img :src="send_img" alt="" class="send_img">
                  <span>发送</span>
                </p>
              <div class="sendbox">
                <p class="addressee">
                  <img :src="man" alt="" class="addressee_icon">
                  <span>收件人：</span>
                </p>
                <input v-model="staff" type="text" class="send_input" disabled>
              </div>
              <div class="sendbox">
                <p class="addressee">
                  <!-- <img src="" alt="" class="addressee_icon"> -->
                  <span>标题：</span>
                </p>
                <input v-model="title" type="text" class="send_input">
              </div>
              <div class="sendbox send_textarea">
                <p class="addressee">
                  <!-- <img src="" alt="" class="addressee_icon"> -->
                  <span>内容：</span>
                </p>
                <textarea v-model="content" class="send_input send_content" no-resize></textarea>
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

// 组件
import navbar from '~/components/common/navbar'
import trfooter from '~/components/common/trfooter'
import ztree from '~/components/common/ztreeNotifi.vue'

// 文件

import icon_check from '~/static/img/workbunch/icon_check.png'
import send_img from '~/static/img/workbunch/send_img.png'
import man from '~/static/img/workbunch/man.png'

let staffArr = []
export default {
  middleware: 'check-login',
  components: {
    navbar,
    trfooter,
    ztree
  },
  head () {
    return {
      title: '卓朗科技_发布通知'
    }
  },
  data () {
    return {
      filterText: '',
      data2: [

      ],
      defaultProps: {
        children: 'childs',
        label: 'label'
      },
      changeStatus: '全选',
      nodeKeys: [],
      staff: '',
      title: '',
      content: '',
      searchResult: '',
      personNum: 0,
      staffList: [],
      department_id: [],
      aim_user_id: [],
      title: '',
      content: '',
      send_img,
      man,
      departmentData: []
    }
  },
  // computed: {
  //   filterText: function(val) {
  //     this.searchResult = val
  //   }
  // },
  watch: {
    filterText (val) {
      this.searchResult = val
      // this.$refs.tree.filter(val);
      this.$refs.toTree.searchNodes(val)
    }
  },
  // async asyncData({ store }) {
  //   let userInfo = store.state.login.userInfo
  //   try {
  //     let staffList = await axios.get('/pcapi/get_recivers',{
  //       params:{
  //         user_id: userInfo.uid,
  //         enterprise_id: userInfo.enterprise_id,
  //       }
  //     })
  //     const { data } = staffList
  //     if (data.code === 0) {
  //       return {
  //         staffList: data.data
  //       }
  //     }
  //   } catch (e) {
  //     // console.log('error', e)
  //   }
  // },

  async asyncData ({store}) {
    let dailysign = await axios.get('/pcapi/employee_manage/department_manage', {
      params: {
        user_id: store.state.login.userInfo.uid
      }
    })
    const {data} = dailysign
    if (data.code === 0) {
      let arr = []
      for (let i = 0; i < data.data.length; i++) {
        // 如果没有父级部门
        let obj = {}

        obj.pId = data.data[i].department_father
        obj.department_id = obj.id = data.data[i].department_id
        obj.name = data.data[i].department_name
        arr.push(obj)

        // obj.name = data.data[i].department_name
        // obj.department_id = obj.id = data.data[i].department_id
        // obj.child = []
        // 遍历子部门
        if (data.data[i].department_child) {
          for (let j = 0; j < data.data[i].department_child.length; j++) {
            let oh = {}
            oh.department_id = oh.id = data.data[i].department_child[j].department_id
            oh.pId = data.data[i].department_child[j].department_father
            oh.name = data.data[i].department_child[j].department_name
            // obj.child.push(oh)
            arr.push(oh)
            for (let k = 0; k < data.data[i].department_child[j].department_employee.length; k++) {
              let ob = {}
              ob.employee_id = ob.id = data.data[i].department_child[j].department_employee[k].employee_id
              ob.pId = data.data[i].department_child[j].department_id
              ob.name = data.data[i].department_child[j].department_employee[k].employee_name
              // obj.child.push(ob)
              arr.push(ob)
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
            // obj.child.push(ob)
            arr.push(ob)
          }
        }
        // arr.push(obj)
      }
      // 未分组员工
      // let object = {
      //   child: [],
      //   department_id: '',
      //   id: '',
      //   name: '未分组员工'
      // }
      let object = {
        pId: '',
        department_id: '',
        id: '88888888',
        name: '未分组员工'
      }
      for (let l = 0; l < data.employee_without_department.length; l++) {
        let so = {}
        so.id = so.employee_id = data.employee_without_department[l].employee_id
        so.name = data.employee_without_department[l].employee_name
        so.pId = '88888888'
        // object.child.push(so)
        arr.push(so)
      }
      arr.push(object)
      // console.log(arr)
      return {
        departmentData: arr,
        canedit: false
      }
    }
  },

  methods: {
    // 获取所选节点
    getSelectedNodes (nodes) {
      this.getKeysArr(nodes)
    },
    onCheck (nodeObj, treeObj) {
      const { label } = nodeObj
      const { checkedNodes } = treeObj
      // this.getCheckedNodes()
      // this.getCheckedKeys()
      const nodes = this.$refs.tree.getCheckedNodes()
      this.getKeysArr(nodes)
    },
    getKeysArr (nodes) {
      let keyArr = []
      let nodeArr = []
      // nodes.map((item) => {
      //   if (item.childs && item.childs.length > 0) {
      //     this.getKeysArr(item.childs)
      //   } else {
      //     keyArr.push(item.id)
      //     nodeArr.push(item.label)
      //   }
      // })
      nodes.map((item) => {
        if (item.employee_id) {
          keyArr.push(item.id)
          nodeArr.push(item.name)
        }
      })
      this.staff = Array.from(new Set(nodeArr))
      this.aim_user_id = Array.from(new Set(keyArr)).join(',')
      console.log(this.staff)
      console.log(this.searchResult)
    },
    // 全选
    allChange () {
      const { changeStatus, staffList } = this
      if (changeStatus === '全选') {
        this.changeStatus = '取消全选'
        this.$refs.toTree.checkAll(true)
        // let keys = []
        // staffList.map((item) => {
        //   keys.push(item.id)
        // })
        // this.setCheckedKeys(keys)
      } else {
        this.changeStatus = '全选'
        this.$refs.toTree.checkAll(false)

        // this.setCheckedKeys([])
      }
    },
    // 设置选中keys
    setCheckedKeys (keys) {
      this.$refs.tree.setCheckedKeys(keys)
      const nodes = this.$refs.tree.getCheckedNodes()
      this.getKeysArr(nodes)
      if (keys.length > 0) {
        // const label =  this.$refs.tree.getCheckedNodes()[0]['label']
        // this.staff = label
      } else {
        this.staff = ''
      }
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 发送邮件
    async onSendEmail () {
      let userInfo = this.$store.state.login.userInfo
      const { staff, title, content, department_id, aim_user_id } = this
      if (staff.length === 0) {
        this.$message({
          message: '请输入收件人',
          type: 'error'
        })
        return
      } else if (title === '') {
        this.$message({
          message: '请输入标题',
          type: 'error'
        })
        return
      } else if (content === '') {
        this.$message({
          message: '请输入内容',
          type: 'error'
        })
        return
      }
      // let email = await axios.get('/pcapi/notice/publish_notification', {
      //   params: {
      //     user_id: userInfo.uid,
      //     department_id,
      //     aim_user_id,
      //     title,
      //     content
      //   }
      // })
      let email = await axios.post('/pcapi/notice/publish_notification', {
        user_id: userInfo.uid,
        department_id,
        aim_user_id,
        title,
        content
      })
      const { data } = email
      if (data.code === 0) {
        this.$message({
          message: data.message,
          type: 'success',
          onClose: () => {
            this.$router.push('/workbunch')
          }

        })
      } else {
        this.$message({
          message: data.message,
          type: 'error'
        })
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
.notification {
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
      overflow: hidden;
      box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      .table_form {
        display: flex;
        padding-bottom: 45px;
        .table_addressee {
          width: 295px;
          height: 780px;
          background-color: #ffffff;
          border-radius: 2px;
          border: solid 1px #a3b8cc;
          margin: 20px 20px 0 40px;
          padding: 16px 13px;
          overflow: hidden;
          .addressee_operate {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .addressee_title {
              color: #333333;
              font-size: 14px;
              line-height: 14px;
              display: inline-block;
            }
            .addressee_change {
              color: #0c7ff5;
              font-size: 13px;
              cursor: pointer;
              display: inline-block;
              border-bottom: 1px solid #0c7ff5;
            }
          }
          .change_number {
            font-size: 14px;
            line-height: 14px;
            color: #999999;
            margin: 19px 0 13px 0;
            .number {
              color: #0c7ff5;
            }
          }
          .search_box {
            width: 273px;
            height: 34px;
            display: flex;
            align-items: center;
            background-color: #ffffff;
            border-radius: 2px;
            border: solid 1px #a3b8cc;
            .search {
              color: #333333;
              font-size: 13px;
              text-indent: 8px;
              width: 220px;
            }
            .seach_icon {
              width: 15px;
              height: 15px;
            }
          }
          .search_result {
            color: #333333;
            font-size: 13px;
            line-height: 13px;
            margin: 16px 0 30px 0;
            height: 13px;
            .search_people {
              color: #0c7ff5;
            }
          }
          .filter-tree{
            height: 600px;
            overflow: auto;
          }
          .ivu-tree {
            margin-left: 17px;
          }
        }
        .table_sendmes {
          .send_btn {
            width: 90px;
            height: 28px;
            background-color: #0c7ff5;
            border-radius: 14px;
            color: white;
            font-size: 13px;
            margin-left: 70px;
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            margin-top: 20px;
            cursor: pointer;
            .send_img {
              width: 15px;
              height: 14px;
              margin-right: 5px;
              margin-left: 17px;
            }
          }
          .sendbox {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .addressee {
              flex: none;
              width: 70px;
              color: #333333;
              font-size: 13px;
              display: flex;
              justify-content: flex-end;
              .addressee_icon {
                width: 14px;
                height: 15px;
                margin-right: 3px;
              }
            }
            .send_input {
              width: 734px;
              height: 34px;
              text-indent: 6px;
              background-color: #ffffff;
              border-radius: 2px;
              border: solid 1px #a3b8cc;
            }
            .send_content {
              height: 250px;
              padding-top: 11px;
              resize: none;
            }
          }
          .send_textarea {
            align-items: flex-start;
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
</style>