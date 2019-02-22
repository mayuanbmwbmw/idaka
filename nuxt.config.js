// const vuxLoader = require('vux-loader')
if (process.client) {
  window.history.replaceState = window.history.replaceState || function () {
  }
}
module.exports = {
  /*
    ** Headers of the page
  */
  debug: true,
  head: {
    title: 'starter',
    meta: [
      {
        charset: 'utf-8',
        keepAlive: true
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0'
      },
      {
        hid: 'description',
        name: 'description',
        content: '打卡助手_一款基于位置服务的上下班打卡应用'
      },
      {
        hid: 'Keywords',
        name: 'Keywords',
        content: '打卡助手,上班打卡,卓朗科技,'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: '/css/iconfont.css'
      }
    ],
    script: [
      {
        src: '../../js/hack.js'
      },
      {
        src: '../../js/rem.js'
      },
      {
        src: '../../js/jquery-1.12.4.min.js'
      },
      {
        src: '../../js/jquery.ztree.all.min.js'
      },
      // {
      //   src: 'http://pv.sohu.com/cityjson?ie=utf-8'
      // }
    ]

  },
  css: ['~/assets/css/reset.min.css', '~/assets/css/main.scss', '~/static/css/metroStyle/metroStyle.css'],
  // proxy: [
  //   [
  //     '/api',
  //     {
  //       target: 'http://192.144.132.48:8080'
  //       target: 'http://118.89.250.39'
  //     }
  //   ]
  // ],
  cache: true,
  build: {
    vendor: ['axios', 'babel-polyfill'],
    // postcss: [ // px转换rem
    //   require('postcss-px2rem-exclude')({
    //     remUnit: 100, // 转换基本单位
    //     exclude: 'node_modules'
    //   })
    // ],
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          // loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
      // const configs = vuxLoader.merge(config, {
      //   options: {
      //     ssr: true
      //   },
      //   plugins: ['vux-ui']
      // })
      // return configs
    },
    babel: {
      // plugins: [['import', {libraryName: 'vant', style: 'css'}]]
      // plugins: [
      //   ['import', {
      //     'libraryName': 'vant',
      //     'style': false
      //   }]
      // ]
    }
  },
  loading: {
    color: '#0c7ff5',
    height: '2px'
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  plugins: [
    {
      src: '~/plugins/element.js',
      ssr: false
    },
    {
      src: '~/plugins/iview.js',
      ssr: false
    }
  ],
  render: {
    bundleRenderer: {
      cache: require('lru-cache')({
        max: 1000,
        maxAge: 1000 * 60 * 15
      })
    }
  },
  router: {
    middleware: ['device']
  }
}
