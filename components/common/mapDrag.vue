<!--
  描述：拖放地图组件，默认尺寸是 500 * 300

  接收属性参数：
    lat: 纬度
    lng: 经度

  自定义事件：
    drag: 拖放完成事件

  示例：
    <mapDrag @drag="dragMap" lat="22.574405" lng="114.095388"></mapDrag>
-->
<template>
    <div class="m-map">
        <div class="search" v-if="placeSearch">
            <input type="text" placeholder="请输入关键字" v-model="searchKey">
            <button type="button" @click="handleSearch">搜索</button>
            <div id="js-result" v-show="searchKey" class="result"></div>
        </div>
        <div id="js-container" class="map"></div>
    </div>
</template>

<script>
  // import remoteLoad from '@/utils/remoteLoad.js'
  // import { MapKey, MapCityName } from '@/config/config'

  const remoteLoad = function (url, hasCallback) {
    return createScript(url)

    /**
     * 创建script
     * @param url
     * @returns {Promise}
     */
    function createScript(url) {
      var scriptElement = document.createElement('script')
      document.body.appendChild(scriptElement)
      var promise = new Promise((resolve, reject) => {
        scriptElement.addEventListener('load', e => {
          removeScript(scriptElement)
          if (!hasCallback) {
            resolve(e)
          }
        }, false)

        scriptElement.addEventListener('error', e => {
          removeScript(scriptElement)
          reject(e)
        }, false)

        if (hasCallback) {
          window.____callback____ = function () {
            resolve()
            window.____callback____ = null
          }
        }
      })

      if (hasCallback) {
        url += '&callback=____callback____'
      }

      scriptElement.src = url

      return promise
    }

    /**
     * 移除script标签
     * @param scriptElement script dom
     */
    function removeScript(scriptElement) {
      document.body.removeChild(scriptElement)
    }
  }

  // 高德地图 key
  const MapKey = 'cfd8da5cf010c5f7441834ff5e764f5b';
  // 地图限定城市
  // const MapCityName = '深圳';

  export default {
    props: {
      lat: 'lat',
      lng: 'lng',
      // 城市名称
      MapCityName: {
        default: '北京'
      },
      // 初始坐标
      coordinate: {
        // 默认北京天安门
        default: [116.397428, 39.90923]
      },
      // 是否有搜索
      search: {
        default: true
      },
      // 初始缩放
      zoom: {
        default: 16
      },
      // 标记点
      marker: {
        default: []
      },
    },
    data() {
      return {
        searchKey: '',
        placeSearch: null,
        dragStatus: false,
        AMapUI: null,
        AMap: null,
        markerOB: null
      }
    }
    ,
    watch: {
      searchKey() {
        if (this.searchKey === '') {
          this.placeSearch.clear()
        }
      }
    }
    ,
    methods: {
      // 搜索
      handleSearch() {
        if (this.searchKey) {
          this.placeSearch.search(this.searchKey)
        }
      }
      ,
      // 实例化地图
      initMap() {
        const that = this
        // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        let AMapUI = this.AMapUI = window.AMapUI
        let AMap = this.AMap = window.AMap
        window.AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
          let mapConfig = {
            zoom: that.zoom,
            // cityName: that.MapCityName
            center: that.coordinate,
          }
          if (this.lat && this.lng) {
            mapConfig.center = [this.lng, this.lat]
          }
          let map = new window.AMap.Map('js-container', mapConfig)
          // 加载地图搜索插件
          that.search && window.AMap.service('AMap.PlaceSearch', () => {
            this.placeSearch = new window.AMap.PlaceSearch({
              pageSize: 5,
              pageIndex: 1,
              citylimit: true,
              city: that.MapCityName,
              map: map,
              panel: 'js-result'
            })
          })
          // 启用工具条
          window.AMap.plugin(['AMap.ToolBar'], function () {
            map.addControl(new window.AMap.ToolBar({
              position: 'RB'
            }))
          })
          // // 创建地图拖拽
          // let positionPicker = new PositionPicker({
          //   mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          //   map: map // 依赖地图对象
          // })
          // // 拖拽完成发送自定义 drag 事件
          // positionPicker.on('success', positionResult => {
          //   // 过滤掉初始化地图后的第一次默认拖放
          //   if (!this.dragStatus) {
          //     this.dragStatus = true
          //   } else {
          //     this.$emit('drag', positionResult)
          //   }
          // })
          // // 启动拖放
          // positionPicker.start()

          // 创建标记点
          if (this.marker.length > 0) {
            this.markerOB = new window.AMap.Marker({
              position: that.marker,
              map: map
            })
          }

          // 创建信息窗体
          // let infowindow = new AMap.InfoWindow({
          //   content: '<h3>高德地图</h1><div>高德是中国领先的数字地图内容、导航和位置服务解决方案提供商。</div>',
          //   offset: new AMap.Pixel(0, -30),
          //   size:new AMap.Size(230,0)
          // })
          // infowindow.open(map,new AMap.LngLat(117.156147, 39.160952));

          // 获取address
          let geocoder = null
          window.AMap.service('AMap.Geocoder', function () {
            geocoder = new window.AMap.Geocoder({});
            geocoder.getAddress(that.marker, function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                // 获得了有效的地址信息:
                // 即，result.regeocode.formattedAddress
                // console.log(result.regeocode.formattedAddress);
                that.$emit('markerAddress', result.regeocode.formattedAddress)
                // let address = result.regeocode.formattedAddress;
              } else {
                // 获取地址失败
              }
            });
          })

        })
      }
    },
    async created() {
      // 已载入高德地图API，则直接初始化地图
      if (window.AMap && window.AMapUI) {
        this.initMap()
        // 未载入高德地图API，则先载入API再初始化
      } else {
        await
          remoteLoad(`https://webapi.amap.com/maps?v=1.3&key=${MapKey}`)
        await
          remoteLoad('https://webapi.amap.com/ui/1.0/main.js')
        this.initMap()
      }
    }
  }
</script>

<style lang="css">
    .m-map {
        min-width: 500px;
        min-height: 300px;
        position: relative;
    }

    .m-map .map {
        width: 100%;
        height: 100%;
    }

    .m-map .search {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 285px;
        z-index: 1;
    }

    .m-map .search input {
        width: 180px;
        border: 1px solid #ccc;
        line-height: 20px;
        padding: 5px;
        outline: none;
    }

    .m-map .search button {
        line-height: 26px;
        background: #fff;
        border: 1px solid #ccc;
        width: 50px;
        text-align: center;
    }

    .m-map .result {
        max-height: 300px;
        overflow: auto;
        margin-top: 10px;
    }
</style>
