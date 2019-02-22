<template>
  <section class="cardsetting">
    <navbar></navbar>
      <div class="check_main">
        <div class="breadcrumb">
          <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
          <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
          <no-ssr>
            <Breadcrumb separator=">">
              <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
              <BreadcrumbItem to="">打卡设置</BreadcrumbItem>
            </Breadcrumb>
          </no-ssr>
        </div>
        <div class="check_table">
          <no-ssr>
            <el-form class="check_table_inline" :model="formItem" inline>
              <div class="form_box">
                <label class="form_title" for="">考勤地点：</label>
                <el-select class="form_address" v-model="formItem.select">
                  <el-option value="beijing">New York</el-option>
                  <el-option value="shanghai">London</el-option>
                  <el-option value="shenzhen">Sydney</el-option>
                </el-select>
              </div>
              <div class="form_box">
                <label class="form_title" for="">所在部门：</label>
                <div class="form_deviation">
                  <img src="" alt="" class="deviation_reduce">
                  <!-- <input type="text" class="deviation_distance"> -->
                  <span>1000KM</span>
                  <img src="" alt="" class="deviation_plus">
                </div>
              </div>
              <div class="form_box">
                <label class="form_title" for="">上班时间：</label>
                <el-time-select
                  v-model="value1"
                  :picker-options="{
                    start: '08:30',
                    step: '00:10',
                    end: '18:00'
                  }"
                  placeholder="选择时间">
                </el-time-select>
              </div>
              <div class="form_box">
                <label class="form_title" for="">下班时间：</label>
                <el-time-select
                  v-model="value1"
                  :picker-options="{
                    start: '08:30',
                    step: '00:10',
                    end: '18:00'
                  }"
                  placeholder="选择时间">
                </el-time-select>
              </div>
            </el-form>
          </no-ssr>
          <div class="cardsetting_map">
            <!--<el-amap class="amap-box" :vid="'amap-vue'"></el-amap>-->
            <mapDrag @drag="dragMap" class="mapbox" style="width: 100%;height: 100%"></mapDrag>
          </div>
        </div>
      </div>
    <trfooter></trfooter>
  </section>
</template>
<script>
// 插件
import axios from "~/plugins/axios";


// 组件
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   Form,
//   FormItem,
//   Button,
//   Input,
//   Select,
//   Page
// } from "iview";
import navbar from "~/components/common/navbar";
import trfooter from "~/components/common/trfooter";
import mapDrag from "~/components/common/mapDrag";

// 文件

import icon_check from "~/static/img/workbunch/icon_check.png";

export default {
  middleware: 'check-login',
  components: {
    navbar,
    trfooter,
    mapDrag,
    // Breadcrumb,
    // BreadcrumbItem,
    // Form,
    // FormItem,
    // Button,
    // Input
  },
  head() {
    return {
      title: "卓朗科技_打卡设置"
    };
  },
  data() {
    return {
      formItem: {
        input: ""
      },
      total: 10,
      value1: ""
    };
  },

  async asyncData({}) {
    try {
      return {};
    } catch (e) {
      // console.log('error', e)
    }
  },
  methods: {
    dragMap (data) {
      console.log(data)
      this.dragData = {
        lng: data.position.lng,
        lat: data.position.lat,
        address: data.address,
        nearestJunction: data.nearestJunction,
        nearestRoad: data.nearestRoad,
        nearestPOI: data.nearestPOI
      }
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
.cardsetting {
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
      padding: 25px 0;
      height: 845px;
      overflow: hidden;
      box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
      border-radius: 10px;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-between;
      .check_table_inline {
        padding: 0 20px;
        padding-bottom: 25px;
        border-bottom: 1px solid #deeaf5;
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
          .form_deviation {
            width: 130px;
            height: 30px;
            border-radius: 2px;
            position: relative;
            border: solid 1px #a3b8cc;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 13px;
            color: #333;
            .deviation_reduce {
              width: 12px;
              height: 2px;
              background-color: #0c7ff5;
            }
            .deviation_plus {
              background-color: #0c7ff5;
              width: 12px;
              height: 2px;
            }
            .deviation_distance {
              position: relative;
              width: 50px;
            }
          }
          .form_address {
            width: 270px;
            height: 30px;
            .el-input__inner {
              width: 270px;
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
          .el-date-editor {
            width: 120px;
            .el-input__inner {
              width: 120px;
              height: 30px;
              line-height: 12px;
              font-size: 12px;
            }
            .el-input__icon {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .el-icon-time {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
      .cardsetting_map {
        display: block;
        width: 1120px;
        height: 683px;
        border-radius: 10px;
        border: solid 1px #dddddd;
        margin: 0 auto;
        margin-top: 40px;
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