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
            <div class="check_table">
                <no-ssr>
                    <el-form class="check_table_inline" :model="formItem" inline>
                        <div class="form_box">
                            <label class="form_title" for="">部门：</label>
                            <el-select class="form_department" v-model="formItem.select">
                                <el-option value="beijing">New York</el-option>
                                <el-option value="shanghai">London</el-option>
                                <el-option value="shenzhen">Sydney</el-option>
                            </el-select>
                        </div>
                        <div class="form_r">
                            <span class="form_export" @click="addDepartment">添加部门</span>
                            <span class="form_export"
                                  @click="editDepartment">{{editStatus === 1 ? '编辑部门' : '结束编辑'}}</span>
                        </div>
                    </el-form>
                </no-ssr>
                <div class="panel_box">
                    <ul id="treeDemo" class="ztree"></ul>
                    <div>
                        <!--<div class="list" v-for="(panelItem, panelIndex) in data.filter((item, i) => i % 3 === index)" :key="panelIndex">-->
                        <div class="list f-l">
                            <div class="panel_head" @click="onClickPanel(1)">
                                <span class="head_title">测试</span>
                                <div class="head_r">
                                    <span v-if="editStatus === 1"
                                          :class="clickIndex === 1 ? 'head_number_selected' : 'head_number'">1人</span>
                                    <!--<span class="head_rename" v-if="editStatus === 2" @click="onRename">重命名</span>-->
                                    <!-- <span class="head_remote"  @click="onRemove">移除</span> -->
                                    <no-ssr>
                                        <Poptip
                                                v-if="editStatus === 2"
                                                class="el_tree_delete"
                                                confirm
                                                title="确认移除吗"
                                                @on-ok="ok"
                                                @on-cancel="cancel"
                                        >
                                            <Button class="list_quit">移除</Button>
                                        </Poptip>
                                    </no-ssr>
                                </div>
                            </div>
                            <div class="tree pb-15" v-if="clickIndex === 1 && clickStatus === 1">
                                <div class="pl-10 pr-10 pb-10">
                                    <input class="tree-search-input" type="text" v-model.lazy="searchword"
                                           placeholder="输入关键词"/>
                                    <button class="ml-10 tree-search-btn" type="button" @click="search">搜索</button>
                                </div>
                                <v-tree ref='tree' :data='treeData' :multiple="true" :tpl='tpl' :halfcheck='true'
                                        :draggable="true"/>
                            </div>
                        </div>

                    </div>

                    <div class="panel_list" v-for="(item, index) in 3" :key="index">
                        <div class="list" v-for="(panelItem, panelIndex) in data.filter((item, i) => i % 3 === index)"
                             :key="panelIndex">
                            <div class="panel_head" @click="onClickPanel(`${index}${panelIndex}`)">
                                <span class="head_title">{{panelItem.label}}</span>
                                <div class="head_r">
                                    <span v-if="editStatus === 1"
                                          :class="clickIndex === `${index}${panelIndex}` ? 'head_number_selected' : 'head_number'">{{panelItem.disabled}}人</span>
                                    <span class="head_rename" v-if="editStatus === 2" @click="onRename">重命名</span>
                                    <!-- <span class="head_remote"  @click="onRemove">移除</span> -->
                                    <no-ssr>
                                        <Poptip
                                                v-if="editStatus === 2"
                                                class="el_tree_delete"
                                                confirm
                                                title="确认移除吗"
                                                @on-ok="ok"
                                                @on-cancel="cancel"
                                        >
                                            <Button class="list_quit">移除</Button>
                                        </Poptip>
                                    </no-ssr>
                                </div>
                            </div>
                            <no-ssr>
                                <div class="child_department"
                                     v-if="clickIndex === `${index}${panelIndex}` && clickStatus === 1">
                                    <el-tree :key="index" :data="panelItem.children" :props="defaultProps"
                                             @node-click="handleNodeClick">
                                        <div class="custom-tree-node" slot-scope="{ node, data }">
                                            <span class="el_tree_dep">{{ node.label }}</span>
                                            <span class="el_tree_number">（{{ node.disabled }}）</span>
                                            <div class="el_tree_operate" v-if="editStatus === 2">
                                                <span class="el_tree_number" @click="onRename">重命名</span>
                                                <no-ssr>
                                                    <Poptip
                                                            class="el_tree_delete"
                                                            confirm
                                                            title="确认移除吗"
                                                            @on-ok="ok"
                                                            @on-cancel="cancel"
                                                    >
                                                        <Button class="list_quit">移除</Button>
                                                    </Poptip>
                                                </no-ssr>
                                            </div>
                                        </div>
                                    </el-tree>
                                </div>
                            </no-ssr>
                            <div class="child_department" v-if="editStatus === 2">
                                <div class="custom_tree_node" v-for="(item, index) in panelItem.children" :key="index">
                                    <span class="el_tree_dep">{{ item.label }}</span>
                                    <div class="el_tree_operate" v-if="editStatus === 2">
                                        <span class="el_tree_number" @click="onRename">重命名</span>
                                        <Poptip
                                                class="el_tree_delete"
                                                confirm
                                                title="确认移除吗"
                                                @on-ok="ok"
                                                @on-cancel="cancel"
                                        >
                                            <Button class="list_quit">移除</Button>
                                        </Poptip>
                                    </div>
                                </div>
                            </div>
                            <div :class="clickIndex === `${index}${panelIndex}` && editStatus === 1? 'panel_content_selected' : 'panel_content'">
                                <div class="content_list" v-for="(item2, index2) in 4" :key="index2">
                                    <span class="list_name" @click="onCheckUser">王思文</span>
                                    <span class="list_phone">18522050286</span>
                                    <span class="list_transfer" @click="onTransferUser">转移</span>
                                    <!-- <span class="list_quit">离职</span> -->
                                    <!-- poptip -->
                                    <no-ssr>
                                        <Poptip
                                                confirm
                                                title="确认王思文已离职吗"
                                                @on-ok="ok"
                                                @on-cancel="cancel"
                                        >
                                            <Button class="list_quit">离职</Button>
                                        </Poptip>
                                    </no-ssr>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- modal -->
        <no-ssr>
            <Modal class="rename_modal" v-model="modal" width="360" :mask="showmask">
                <!--<p class="modal_title" slot="header">{{alertStatus === 1? '添加部门' : '重命名部门'}}</p>-->
                <p class="modal_title" slot="header">修改名称</p>
                <div class="modal_container">
                    <input type="text" class="modal_input" placeholder="请输入新的名称">
                </div>
                <div class="modal_footer" slot="footer">
                    <!--<span class="modal_allow" @click="onConfirm">{{alertStatus === 1? '下一步' : '确认'}}</span>-->
                    <span class="modal_allow" @click="onConfirm">确认</span>
                    <span class="modal_refuse" @click="onCancel">取消</span>
                </div>
            </Modal>
        </no-ssr>
        <!-- modal 添加人员 -->
        <no-ssr>
            <Modal class="plus_modal" v-model="plus_modal" width="360" :mask="showmask">
                <p class="modal_title" slot="header">为部门添加人员</p>
                <div class="modal_container">
                    <div class="modal_left">
                        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
                            <el-transfer v-model="value1" :data="data"></el-transfer>
                        </el-tree>
                    </div>
                    <div class="modal_right">
                        <p class="right_title">已选人员(10人):</p>
                        <ul class="right_ul">
                            <li class="right_list" v-for="(item, index) in 10" :key="index">
                                <div class="list_user">
                                    <img src="" alt="" class="list_icon">
                                    <span class="list_name">王思文</span>
                                </div>
                                <img src="" alt="" class="list_delete">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal_footer" slot="footer">
                    <span class="modal_refuse modal_last" @click="jumpLastStep">上一步</span>
                    <span class="modal_allow" @click="onConfirm">确认</span>
                    <span class="modal_refuse" @click="onCancel">取消</span>
                </div>
            </Modal>
        </no-ssr>
        <!-- modal 转移部门 -->
        <no-ssr>
            <Modal class="transfer_modal" v-model="transfer_modal" width="360" :mask="showmask">
                <div class="modal_container">
                    <div class="modal_left">
                        <p class="left_user">
                            <img src="" alt="" class="user_icon">
                            <span class="user_name">王思文</span>
                        </p>
                        <p class="user_department_title">现所在部门</p>
                        <p class="user_department_content">技术中心—软件设计与用户体验部</p>
                    </div>
                    <div class="modal_right">
                        <p class="right_title">转移至：</p>
                        <ul class="right_ul">
                            <div class="list_department"
                                 :class="depIndex === index ? 'list_department_checked' : 'list_department'"
                                 @click="onClickDep(index)" v-for="(item, index) in 10" :key="index">
                                <span class="department_title">管理层</span>
                                <img src="" alt="" :style="{display: depIndex === index ? 'block' : 'none'}"
                                     class="department_delete">
                            </div>
                        </ul>
                    </div>
                </div>
                <div class="modal_footer" slot="footer">
                    <span class="modal_allow" @click="onConfirm">确认</span>
                    <span class="modal_refuse" @click="onCancel">取消</span>
                </div>
            </Modal>
        </no-ssr>
        <!-- modal 员工详情 -->
        <no-ssr>
            <Modal class="detail_modal" v-model="detail_modal" width="360" :mask="showmask">
                <div class="modal_container">
                    <div class="modal_user">
                        <img src="" alt="" class="user_icon">
                        <p class="user_department_content">
                            <span class="user_name">王思文</span>
                            <span class="user_dep">技术中心—软件设计与用户体验部</span>
                        </p>
                    </div>

                    <div class="user_info">
                        <span class="form_title">性别：</span>
                        <p class="info_phone"><span>男</span>电话：<span>18522050286</span></p>
                    </div>
                    <p class="user_form">
                        <span class="form_title">内部电话：</span>
                        <input type="text" class="form_input">
                    </p>
                    <p class="user_form">
                        <span class="form_title">公司邮箱：</span>
                        <input type="text" class="form_input">
                    </p>
                    <p class="user_form">
                        <span class="form_title">工号：</span>
                        <input type="text" class="form_input">
                    </p>
                    <p class="user_form">
                        <span class="form_title">入职日期：</span>
                        <input type="text" class="form_input">
                    </p>

                </div>
                <div class="modal_footer" slot="footer">
                    <span class="modal_allow" @click="onConfirm">确认</span>
                    <span class="modal_refuse" @click="onCancel">取消</span>
                </div>
            </Modal>
        </no-ssr>
        <trfooter></trfooter>
    </section>
</template>

<script>

  // 插件
  // import axios from "~/plugins/axios";
  // import $ from "jquery";
  // 组件
  import navbar from "~/components/common/navbar";
  import trfooter from "~/components/common/trfooter";
  // import {Tree} from "element-ui";
  // import ztree from 'ztree'

  // 文件

  import icon_check from "~/static/img/workbunch/icon_check.png";

  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter,
      // "el-tree": Tree
    },
    head() {
      return {
        title: "卓朗科技_打卡助手"
      };
    },
    data() {
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
            disabled: i % 4 === 0
          });
        }
        return data;
      };
      return {
        // 测试数据
        lang: 'zh',
        searchword: '',
        treeData: [
          {
            title: '前端开发部',
            expanded: false,
            children: [
              {
                title: '前端开发一组',
                expanded: false,
                children: [
                  {
                    title: "<span style='color: red'>吴建</span>"
                  },
                  {
                    title: '赵玉涛'
                  },
                  {
                    title: '张彬'
                  }
                ]
              },
              {
                title: '前端开发二组',
                children: [
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                ]
              },
              {
                title: '前端开发三组',
                children: [
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                ]
              }
            ]
          },
          {
            title: '移动端开发部',
            expanded: false,
            children: [
              {
                title: '移动端开发一组',
                expanded: false,
                children: [
                  {
                    title: "<span style='color: red'>于连林</span>"
                  },
                  {
                    title: '木心驰'
                  },
                  {
                    title: '何金刚'
                  }
                ]
              },
              {
                title: '移动端开发二组',
                children: [
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                ]
              },
              {
                title: '移动端开发三组',
                children: [
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                ]
              }
            ]
          },
          {
            title: 'UED部',
            expanded: false,
            children: [
              {
                title: 'UED一组',
                expanded: false,
                children: [
                  {
                    title: "<span style='color: red'>刘越文</span>"
                  },
                  {
                    title: '章伯钧'
                  },
                  {
                    title: '王维'
                  }
                ]
              },
              {
                title: 'UED二组',
                children: [
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                ]
              },
              {
                title: 'UED三组',
                children: [
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                  {
                    title: "王大锤"
                  },
                ]
              }
            ]
          }
        ],


        formItem: {
          input: ""
        },
        total: 10,
        value1: "0",
        clickIndex: -1,
        modal: false,
        showmask: true,
        editStatus: 1,
        alertStatus: -1,
        depIndex: -1,
        data: [
          {
            label: "管理层",
            disabled: 25,
            children: [
              {
                label: "前端部门",
                disabled: 10,
                children: [
                  {
                    label: "web端",
                    disabled: 10,
                    children: [
                      {
                        label: "web端",
                        disabled: 10
                      }
                    ]
                  }
                ]
              },
              {
                label: "移动部门",
                disabled: 15,
                children: [
                  {
                    label: "移动端",
                    disabled: 15
                  }
                ]
              }
            ]
          },
          {
            label: "党群工作部",
            disabled: 25,
            children: [
              {
                label: "前端部门",
                disabled: 10,
                children: [
                  {
                    label: "web端",
                    disabled: 10
                  }
                ]
              },
              {
                label: "移动部门",
                disabled: 15,
                children: [
                  {
                    label: "移动端",
                    disabled: 15
                  }
                ]
              }
            ]
          },
          {
            label: "技术中心",
            disabled: 25,
            children: [
              {
                label: "前端部门",
                disabled: 10,
                children: [
                  {
                    label: "web端",
                    disabled: 10
                  }
                ]
              },
              {
                label: "移动部门",
                disabled: 15,
                children: [
                  {
                    label: "移动端",
                    disabled: 15
                  }
                ]
              }
            ]
          },
          {
            label: "技术中心",
            disabled: 25,
            children: [
              {
                label: "前端部门",
                disabled: 10,
                children: [
                  {
                    label: "web端",
                    disabled: 10
                  }
                ]
              },
              {
                label: "移动部门",
                disabled: 15,
                children: [
                  {
                    label: "移动端",
                    disabled: 15
                  }
                ]
              }
            ]
          }
        ],
        defaultProps: {
          children: "children",
          label: "label",
          id: "id"
        },
        plus_modal: false,
        transfer_modal: false,
        detail_modal: false,
        clickStatus: 1,
        data1: generateData(),
        value1: [1, 4]
      };
    },

    async asyncData({}) {
      try {
        return {};
      } catch (e) {
        // console.log('error', e)
      }
    },
    mounted() {
      // let dom = $('.ivu-tree-children')
      // $('.ivu-tree-children').css('display', 'none')
      // console.info($('.ivu-tree-children'))
      const {data} = this
      // this.filterTree(data)

      var zTreeObj;
      // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
      var setting = {};
      // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
      var zNodes = [
        {name:"test1", open:true, children:[
            {name:"test1_1"}, {name:"test1_2"}]},
        {name:"test2", open:true, children:[
            {name:"test2_1"}, {name:"test2_2"}]}
      ];
      zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);


    },
    methods: {
      // 测试方法
      // tpl (node, ctx, parent, index, props) {
      tpl (...args) {
        let {0: node, 2: parent, 3: index} = args
        let titleClass = node.selected ? 'node-title node-selected' : 'node-title'
        if (node.searched) titleClass += ' node-searched'
        return <span>
        <button class="treebtn1" onClick={() => this.$refs.tree.addNode(node, {title: 'sync node'})}>+</button>
        <span class={titleClass} domPropsInnerHTML={node.title} onClick={() => {this.$refs.tree.nodeSelected(node)}}></span>
        <button class="treebtn2" onClick={() => this.changeNode(node, parent, index)}>修改</button>
        <button class="treebtn3" onClick={() => this.$refs.tree.delNode(node, parent, index)}>移除</button>
        </span>
      },
      // <button class="treebtn2" onClick={() => this.asyncLoad(node)}>async</button>
      async asyncLoad(node) {
        this.$set(node, 'loading', true)
        let pro = new Promise(resolve => {
          setTimeout(resolve, 2000, ['async node1', 'async node2'])
        })
        this.$refs.tree.addNodes(node, await pro)
        this.$set(node, 'loading', false)
      },
      search() {
        this.$refs.tree.searchNodes(this.searchword)
      },
      changeNode(node, parent, index) {
        this.onRename(node, parent, index)
        console.log(node)
        console.log(parent)
        console.log(index)
        console.log( this.$refs.tree)
      },


      // 遍历树
      filterTree(data) {
        data.map((item) => {
          for (let i in item) {
            if (i === 'children') {
              this.filterTree(item[i])
            }
          }
        })
      },
      // 点击panel
      onClickPanel(index) {
        const {clickIndex, editStatus} = this;
        if (clickIndex !== index && editStatus === 1) {
          this.clickIndex = index;
        } else {
          this.clickIndex = -1;
        }
      },
      onConfirm() {
        const {alertStatus} = this;
        this.modal = false;
        this.transfer_modal = false;
        this.detail_modal = false;
        if (alertStatus === 1) {
          this.plus_modal = true;
        } else {
          // this.$Message.success("您已添加新部门");
        }
      },
      onCancel() {
        this.modal = false;
        this.plus_modal = false;
        this.transfer_modal = false;
        this.detail_modal = false;
      },
      // 确定离职
      ok() {
        this.$Message.info("You click ok");
      },
      // 取消离职
      cancel() {
        this.$Message.info("You click cancel");
      },
      // 添加部门
      addDepartment() {
        this.modal = true;
        this.alertStatus = 1;
      },
      // 编辑部门
      editDepartment() {
        const {editStatus} = this;
        if (editStatus === 1) {
          this.editStatus = 2;
          this.clickStatus = 2;
        } else {
          this.editStatus = 1;
          this.clickStatus = 1;
          this.clickIndex = -1;
        }
      },
      // 重命名
      onRename(node, parent, index) {
        this.modal = true;
        this.alertStatus = 2;
      },
      // 移除部门
      onRemove() {
        const {depIndex} = this;
        if (depIndex < 0 || depIndex !== index) {
          this.depIndex = index;
        } else {
          this.depIndex = -1;
        }
      },
      // 点击tree node
      handleNodeClick(data) {
        console.log(data);
      },
      // 查看用户详情
      onCheckUser() {
        this.detail_modal = true;
      },
      //
      onTransferUser() {
        this.transfer_modal = true;
      },
      // 点击部门转移
      onClickDep(index) {
        const {depIndex} = this;
        if (depIndex < 0 || depIndex !== index) {
          this.depIndex = index;
        } else {
          this.depIndex = -1;
        }
      },
      // 返回上一步
      jumpLastStep() {
        this.transfer_modal = false;
        this.plus_modal = true;
      },
      renderContent(h, {root, node, data}) {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              width: "100%"
            }
          },
          [
            h("span", [
              h("img", {
                style: {
                  marginRight: "8px",
                  backgroundColor: "#0c7ff5",
                  width: "19px",
                  height: "19px"
                },
                on: {
                  click: () => {
                    this.append(data);
                  }
                }
              }),
              h("span", data.title)
            ]),
            h(
              "span",
              {
                style: {
                  display: "inline-block",
                  float: "right",
                  marginRight: "32px"
                }
              },
              [
                h("img", {
                  style: {
                    marginRight: "8px",
                    backgroundColor: "#0c7ff5",
                    width: "19px",
                    height: "19px"
                  },
                  on: {
                    click: () => {
                      this.append(data);
                    }
                  }
                })
              ]
            )
          ]
        );
      }
    }
  };
</script>
<style lang="scss">
    .ivu-breadcrumb a {
        color: #999999;
    }

    .ivu-select-selection {
        border-radius: 2px;
        border: solid 1px #a3b8cc;
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
                height: 450px;
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
                    padding: 20px 20px 0 30px;
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
                            width: 120px;
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

    .tree3 {
        float: left;
        width: 33%;
        padding: 10px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px dotted #ccccdd;
        overflow: auto;
        height: 800px;
    }

    .treebtn1 {
        background-color: transparent;
        border: 1px solid #ccc;
        padding: 1px 3px;
        border-radius: 5px;
        margin-right: 5px;
        color: rgb(148, 147, 147);
        cursor: pointer;
    }

    .treebtn2 {
        background-color: transparent;
        border: 1px solid #ccc;
        padding: 3px 5px;
        border-radius: 5px;
        margin-left: 5px;
        color: rgb(97, 97, 97);
        cursor: pointer;
    }

    .treebtn3 {
        background-color: transparent;
        border: 1px solid #ccc;
        padding: 3px 5px;
        border-radius: 5px;
        margin-left: 5px;
        color: rgb(63, 63, 63);
        cursor: pointer;
    }

    .tree-search-input {
        width: 70%;
        padding: 6px 8px;
        outline: none;
        border-radius: 6px;
        border: 1px solid #ccc;
    }

    .tree-search-btn {
        width: 25%;
        padding: 6px 8px;
        outline: none;
        border-radius: 6px;
        background-color: rgb(218, 218, 218);
        border: 1px solid rgb(226, 225, 225);
        color: rgb(117, 117, 117);
    }




    // 组件样式调整
    .halo-tree li:after, .halo-tree li:before{
        left: 8px;
    }
    .halo-tree li.leaf:after{
        left: 10px;
        width: 10px;
    }
    .halo-tree ul{
        padding-left: 0;
        padding-top: 5px;
    }
    .halo-tree .inputCheck{
        top: 2px;
    }
    // 第一节点不显示删除
    .tree>.halo-tree>li>.tree-node-el>span:last-child .treebtn3 {
        display: none;
    }
    /*.halo-tree .tree-node-el{*/
        /*z-index: 0;*/
    /*}*/
    @import "../../../assets/css/common.css";
</style>