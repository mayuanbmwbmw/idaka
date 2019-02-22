<template>
    <section class="attendancedetail">
        <navbar></navbar>
        <div class="check_main">
            <div class="breadcrumb">
                <!-- <nuxt-link :to="``" class="breadcrumb_item">工作台 ></nuxt-link>
                <nuxt-link :to="``" class="breadcrumb_item">考勤统计 ></nuxt-link> -->
                <no-ssr>
                    <Breadcrumb separator=">">
                        <BreadcrumbItem to="/workbunch">工作台</BreadcrumbItem>
                        <BreadcrumbItem :to="checkstatic === '' ? '/workbunch/checkstatistic' : checkstatic"
                                        v-if="!$route.query.dailyPage">考勤统计
                        </BreadcrumbItem>
                        <BreadcrumbItem to="/workbunch/checkstatistic/checkdaily" v-if="$route.query.dailyPage">每日考勤
                        </BreadcrumbItem>
                        <BreadcrumbItem :to="signlist === '' ? './outcheckattendance': signlist"
                                        v-if="!$route.query.dailyPage">查看考勤
                        </BreadcrumbItem>
                        <!--<BreadcrumbItem :to="outsignlist === '' ? './attendancelist': outsignlist">查看外勤</BreadcrumbItem>-->
                        <BreadcrumbItem :to="outsignlist === '' ? './attendancelist': outsignlist">查看外勤</BreadcrumbItem>
                        <BreadcrumbItem to="">外勤详情</BreadcrumbItem>
                    </Breadcrumb>
                </no-ssr>
            </div>
            <div class="check_table">
                <div class="check_user">
                    <p class="user_name">{{ query_name }}</p>
                    <p class="user_time">{{ outsignInfo.outsign_time }}</p>
                </div>
                <div class="check_describe">
                    <!--<img src="" alt="" class="check_map">-->
                    <div class="check_map" v-if="outsignInfo.lon">
                        <mapDrag
                                v-if="outsignInfo.lon"
                                @drag="dragMap"
                                :search="false"
                                :coordinate="[outsignInfo.lon, outsignInfo.lat]"
                                :zoom="20" :marker="[outsignInfo.lon, outsignInfo.lat]"
                                @markerAddress="markerAddress"
                                style="width: 100%;height: 100%"
                        ></mapDrag>
                    </div>
                    <div class="check_reason" v-if="outsignInfo.lon">
                        <div class="reason_question">
                            <span class="question_title">{{ outsignInfo.activity_name || '外勤打卡' }}</span>
                            <div class="question_page">
                                <span class="page_last" :style="{backgroundColor: prev === '' ? '#eee' : ''}"
                                      @click="lastOutSign">上一个外勤</span>
                                <span class="page_next" :style="{backgroundColor: next === '' ? '#eee' : ''}"
                                      @click="nextOutSign">下一个外勤</span>
                            </div>
                        </div>
                        <p class="reason_address">地点：{{ outsignInfo.place }}</p>
                        <p class="reason_time">时间：{{ outsignInfo.outsign_time }}</p>
                        <p class="reason_detail">{{ outsignInfo.activity_info || '无' }}</p>
                    </div>
                    <p class="check_empty" v-if="!outsignInfo.lon">暂无数据</p>
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

  import icon_check from '~/static/img/workbunch/icon_check.png'
  import mapDrag from '~/components/common/mapDrag'

  export default {
    middleware: 'check-login',
    components: {
      navbar,
      trfooter,
      mapDrag
    },
    head() {
      return {
        title: '卓朗科技_考勤统计_查看考勤_查看外勤_外勤详情'
      }
    },
    data() {
      return {
        outsignInfo: {
          place: ''
        },
        checkstatic: '',
        fullPath: '',
        signlist: '',
        outsignlist: '',
        prev: '',
        next: '',
        query_name: ''
      }
    },
    // 初始化 查看考勤
    async asyncData({query, route, store}) {
      const outsign_id = query.outsign_id
      const query_name = query.query_name
      let userInfo = store.state.login.userInfo
      try {
        let outsignInfo = await axios.get('/pcapi/sign/outsign_details', {
          params: {
            // token,
            outsign_id,
            user_id: userInfo.uid
          }
        })
        const {data} = outsignInfo
        if (data.code === 0) {
          return {
            outsignInfo: data.data,
            next: data.next,
            prev: data.prev,
            query_name
          }
        }
      } catch (e) {
        console.log('error', e)
      }
    },
    mounted() {
      const signlist = sessionStorage.getItem('signlist')
      const outsignlist = sessionStorage.getItem('outsignlist')
      this.checkstatic = sessionStorage.getItem('checkstatic')
      console.log(signlist, outsignlist)
      // console.log(signlist, outsignlist)
      this.signlist = signlist
      this.outsignlist = outsignlist
      console.log('百度坐标', this.outsignInfo.lat, this.outsignInfo.lon)
      let obj = this.bd_decrypt(this.outsignInfo.lon, this.outsignInfo.lat)
      this.outsignInfo.lat = obj.lat
      this.outsignInfo.lon = obj.lng
      console.log('高德坐标', this.outsignInfo.lat, this.outsignInfo.lon)
    },
    methods: {
      // 百度坐标转高德（传入经度、纬度）
      bd_decrypt(bd_lng, bd_lat) {
        var X_PI = Math.PI * 3000.0 / 180.0
        var x = bd_lng - 0.0065
        var y = bd_lat - 0.006
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
        var gg_lng = z * Math.cos(theta)
        var gg_lat = z * Math.sin(theta)
        return {lng: gg_lng, lat: gg_lat}
      },
      // 高德坐标转百度（传入经度、纬度）
      bd_encrypt(gg_lng, gg_lat) {
        var X_PI = Math.PI * 3000.0 / 180.0
        var x = gg_lng, y = gg_lat
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI)
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI)
        var bd_lng = z * Math.cos(theta) + 0.0065
        var bd_lat = z * Math.sin(theta) + 0.006
        return {
          bd_lat: bd_lat,
          bd_lng: bd_lng
        }
      },
      // 上一个外勤
      lastOutSign() {
        const {prev, query_name} = this
        if (prev !== '') {
          this.$router.push(`./attendancedetail?outsign_id=${prev}&query_name=${query_name}`)
          let outTimeout = setTimeout(() => {
            location.reload()
          }, 100)
        }
      },
      // 下一个外勤
      nextOutSign() {
        const {next, query_name} = this
        if (next !== '') {
          this.$router.push(`./attendancedetail?outsign_id=${next}&query_name=${query_name}`)
          let outTimeout = setTimeout(() => {
            location.reload()
          }, 100)
        }
      },
      // 地图拖动
      dragMap(data) {
        console.log(data)
        this.dragData = {
          lng: data.position.lng,
          lat: data.position.lat,
          address: data.address,
          nearestJunction: data.nearestJunction,
          nearestRoad: data.nearestRoad,
          nearestPOI: data.nearestPOI
        }
      },
      // 获取地图标记点Address
      markerAddress(data) {
        // console.log(data)
        this.outsignInfo.place = data
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

    .attendancedetail {
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
                padding: 34px 0;
                height: 845px;
                overflow: hidden;
                box-shadow: 0px 5px 24px 0px rgba(35, 30, 55, 0.16);
                border-radius: 10px;
                background-color: white;
                .check_user {
                    padding-left: 42px;
                    padding-bottom: 22px;
                    border-bottom: 1px solid #eeeeee;
                    .user_name {
                        color: #333333;
                        font-size: 18px;
                    }
                    .user_time {
                        color: #999999;
                        font-size: 14px;
                    }
                }
                .check_describe {
                    padding: 20px 20px 0 32px;
                    display: flex;
                    .check_map {
                        width: 520px;
                        height: 300px;
                        border-radius: 10px;
                        border: solid 1px #dddddd;
                        margin-right: 40px;
                    }
                    .check_reason {
                        flex: 1;
                        .reason_question {
                            display: flex;
                            justify-content: space-between;
                            .question_title {
                                color: #333333;
                                font-size: 18px;
                            }
                            .question_page {
                                display: flex;
                                align-items: center;
                                span {
                                    height: 30px;
                                    background-color: #ffffff;
                                    border-radius: 4px;
                                    border: solid 1px #deeaf5;
                                    font-size: 13px;
                                    color: #333333;
                                    display: inline-flex;
                                    justify-content: center;
                                    align-items: center;
                                }
                                .page_last {
                                    margin-right: 10px;
                                    position: relative;
                                    padding: 9px 8px 9px 22px;
                                    cursor: pointer;
                                    &::before {
                                        content: "";
                                        position: absolute;
                                        top: 10px;
                                        left: 5px;
                                        width: 0;
                                        height: 0;
                                        border-right: 7px solid #cccccc;
                                        border-top: 4.5px solid transparent;
                                        border-bottom: 4.5px solid transparent;
                                    }
                                }
                                .page_next {
                                    position: relative;
                                    padding: 9px 22px 9px 8px;
                                    cursor: pointer;
                                    &::before {
                                        content: "";
                                        position: absolute;
                                        top: 10px;
                                        right: 5px;
                                        width: 0;
                                        height: 0;
                                        border-left: 7px solid #cccccc;
                                        border-top: 4.5px solid transparent;
                                        border-bottom: 4.5px solid transparent;
                                    }
                                }
                            }
                        }
                        .reason_address {
                            font-size: 13px;
                            line-height: 13px;
                            color: #999999;
                            margin-bottom: 8px;
                            margin-top: 24px;
                        }
                        .reason_time {
                            font-size: 13px;
                            line-height: 13px;
                            color: #999999;
                            margin-bottom: 20px;
                        }
                        .reason_detail {
                            line-height: 24px;
                            letter-spacing: 0px;
                            color: #333333;
                            font-size: 14px;
                            width: 562px;
                        }
                    }
                    .check_empty {
                        color: #909399;
                        font-size: 12px;
                        text-align: center;
                        margin: 20px 0;
                        flex: 1;
                    }
                }
            }
        }
    }
</style>