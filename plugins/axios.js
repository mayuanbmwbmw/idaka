import * as axios from 'axios'
// const https = require('https')
// process.env.SERVER = '生产：http://i.hexinjia.com 测试：http://192.144.132.48:8080' 本地 http://192.168.1.108:8080
// 173 服务器 172.25.102.173:8002
// 175 服务器 172.25.102.175:8002
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' // https SSL 认证
// process.env.SERVER = process.env.NODE_ENV === 'production' ? 'http://172.25.102.173:8002' : 'http://172.26.1.198:8002'
// let path = process.env.sitMode ? 'http://172.27.106.5:8002' : (process.env.is173 ? '172.25.102.173:8002' : '172.25.102.175:8002')
process.env.SERVER = process.env.NODE_ENV === 'production' ? 'http://172.25.102.175:8002' : 'http://172.27.106.5:8002'

axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 0
// axios.defaults.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
let options = {
}
// The server-side needs a full url to works
// console.info('process.env', process.env.NODE_ENV)
// console.info('process.server', process.server)
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 2009}`
}

// 在main.js设置全局的请求次数，请求的间隙
// axios.defaults.retry = 4
// axios.defaults.retryDelay = 1000
//
// axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
//   var config = err.config
//   // If config does not exist or the retry option is not set, reject
//   if (!config || !config.retry) return Promise.reject(err)
//
//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0
//
//   // Check if we've maxed out the total number of retries
//   if (config.__retryCount >= config.retry) {
//     // Reject with the error
//     return Promise.reject(err)
//   }
//
//   // Increase the retry count
//   config.__retryCount += 1
//
//   // Create new promise to handle exponential backoff
//   var backoff = new Promise(function (resolve) {
//     setTimeout(function () {
//       resolve()
//     }, config.retryDelay || 1)
//   })
//
//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function () {
//     return axios(config)
//   })
// })

export default axios.create(options)
