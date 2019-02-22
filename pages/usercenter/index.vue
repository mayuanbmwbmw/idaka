<template>
    <section class="usercenter">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">首页</BreadcrumbItem>
                        <BreadcrumbItem to="">个人中心</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table">
                <div class="topCon">
                    <div class="headImg">
                        <img :src="elogo" alt="">
                    </div>

                    <div style="height: 15px"></div>
                    <div class="topItem"><span class="name">{{detailName}}</span></div>
                    <div class="topItem">绑定手机：<span class="default">{{editForm.phone}}</span></div>
                    <div class="topItem"><span class="f-s-20">{{detailDep}}</span></div>
                    <div class="topItem">公司邮箱：<span class="default">{{editForm.mail}}</span></div>
                </div>
                <div class="underCon tele">
                    <p>内部电话</p>
                    <p>{{editForm.tele}}</p>
                </div>
                <div class="underCon code">
                    <p>个人工号</p>
                    <p>{{editForm.code}}</p>
                </div>
                <div class="underCon posi">
                    <p>职位</p>
                    <p>{{editForm.level}}</p>
                </div>
                <div class="underCon date">
                    <p>入职时间</p>
                    <p>{{editForm.date}}</p>
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

// 文件
import avatar from '~/static/img/user/avatar.png'
import { enterpriseList, personList } from '~/utils/avatar'

export default {
  middleware: 'check-login',
  components: {
    navbar,
    trfooter
  },
  head () {
    return {
      title: '卓朗科技_用户中心'
    }
  },
  data () {
    return {
      avatar: avatar,
      detailName: '',
      detailDep: '',
      editForm: {
        date: '',
        tele: '',
        code: '',
        mail: '',
        phone: '',
        level: ''
      },
      elogo: ''
    }
  },
  async asyncData ({ store, redirect }) {
    const user_id = store.state.login.userInfo.uid
    let dailysign = await axios.get('/pcapi/employee_manage/employee_info', {
      params: {
        user_id,
        employee_id: user_id
      }
    })
    const { data } = dailysign
    if (data.code === 0) {
      const elogo = personList.filter(item => item.key === data.data.elogo)
      return {
        detailName: data.data.name || '空',
        detailDep: data.data.enterprise || '空',
        editForm: {
          date: data.data.entry_date || '空',
          tele: data.data.work_phone || '空',
          phone: data.data.phone || '空',
          code: data.data.work_number || '空',
          mail: data.data.email || '空',
          level: data.data.level || '空'
        },
        elogo: (elogo[0] && elogo[0]['img']) || avatar
      }
    }
  },
  mounted () {},
  methods: {
    // 添加部门-获取人员信息
    // async employee_info(obj) {
    //   obj = obj || {}
    //   let dailysign = await axios.get('/pcapi/employee_manage/employee_info', {
    //     params: obj
    //   })
    //   const {data} = dailysign
    //   if (data.code === 0) {
    //     return data.value
    //   }
    // },
  }
}
</script>
<style lang="scss" scoped>
.usercenter {
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
      padding: 40px 60px;
      height: 845px;
      overflow: hidden;
      box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
      border-radius: 10px;

      .topCon {
        height: 140px;
        border-bottom: 1px solid #e5e5e5;
      }

      .underCon {
        height: 80px;
        border-bottom: 1px solid #e5e5e5;
        padding-left: 80px;
        padding-top: 15px;
        font-size: 15px;

        p:first-child {
          font-weight: bold;
        }
        p:last-child {
          color: #989898;
        }
      }
      .underCon.tele {
        background: url("~/static/img/user/uc_07.png") no-repeat left center;
      }
      .underCon.code {
        background: url("~/static/img/user/uc_10.png") no-repeat left center;
      }
      .underCon.posi {
        background: url("~/static/img/user/uc_13.png") no-repeat left center;
      }
      .underCon.date {
        background: url("~/static/img/user/uc_15.png") no-repeat left center;
      }

      .headImg {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        float: left;
        background-color: grey;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .topItem {
        display: inline-block;
        width: 480px;
        height: 30px;
        padding-left: 20px;
        font-size: 17px;

        .name {
          font-size: 25px;
          /*font-weight: bold;*/
        }
        .name:after {
          content: "";
          display: inline-block;
          width: 30px;
          height: 37px;
          vertical-align: top;
          background: url("~/static/img/user/uc_03.png") no-repeat center;
        }
        .default {
          color: #989898;
        }
        .f-s-20 {
          font-size: 19px;
          color: #989898;
        }
      }
    }
  }
}
</style>