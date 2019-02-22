import { Router } from 'express'
import axios from '../../plugins/axios'
import qs from 'querystring'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
const router = Router()
let baseUrl = ''
// let exportUrl = null
//  enterprise_id === f77c4a9f4fbb4f89a6aace394199ec4d
//  enterprise_id === fa4e1721bf864ad4b09d0ecabb2e08ad

// 公共api
const callApi = (query, api, res, req) => {
  baseUrl = process.env.SERVER
  return axios.post(baseUrl + api, qs.stringify(query)).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    res.json(err.status)
  })
}
// 导出excel get
const callApiGet = (query, api, res, req) => {
  return axios.get(baseUrl + api, {
    params: query
  }, { responseType: 'blob' }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    res.json(err.status)
  })
}

/* 每日考勤 */
router.get('/sign/dailysign', function (req, res, next) {
  // exportUrl = null
  const query = Object.assign(req.query)
  const api = '/sign/dailysign'

  callApi(query, api, res, req)
})
/* 导出当日考勤 */
router.get('/sign/dailysign_export', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/dailysign_export'

  callApiGet(query, api, res, req)
})
router.get('/sign/dailysign_export_days', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/dailysign_export_days'

  callApiGet(query, api, res, req)
})

/* 当日考勤导出进度 */
router.get('/sign/record_dailysign_percent', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/record_dailysign_percent'

  callApi(query, api, res, req)
})
/* 考勤统计 */
router.get('/sign/signcount', function (req, res, next) {
  // exportUrl = null
  const query = Object.assign(req.query)
  const api = '/sign/signcount'

  callApi(query, api, res, req)
})

/* 导出考勤统计 */
router.get('/sign/signcount_export', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/signcount_export'

  callApi(query, api, res, req)
})

/* 导出旧版考勤统计 */
router.get('/sign/signcount_export_old', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/signcount_export_old'

  callApi(query, api, res, req)
})

/* 获取文件名 */
router.get('/sign/getfilename', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/getfilename'

  callApi(query, api, res, req)
})
/* 考勤统计导出进度 */
router.get('/sign/record_signcount_percent', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/record_signcount_percent'

  callApi(query, api, res, req)
})

/* 下载考勤统计文件 */
router.get('/sign/export_download', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/export_download'

  callApi(query, api, res, req)
})

/* 查看考勤 */
router.get('/sign/signquery', function (req, res, next) {
  // exportUrl = null
  const query = Object.assign(req.query)
  const api = '/sign/signquery'

  callApi(query, api, res, req)
})
/* 导出查看考勤 */
router.get('/sign/signquery_export', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/signquery_export'

  callApi(query, api, res, req)
})
/* 查看考勤导出进度 */
router.get('/sign/record_signquery_percent', function (req, res, next) {
  // exportUrl = 'http://172.25.102.175:8002'
  const query = Object.assign(req.query)
  const api = '/sign/record_signquery_percent'

  callApi(query, api, res, req)
})
/* 查看外勤 */
router.get('/sign/outsignquery', function (req, res, next) {
  // exportUrl = null
  const query = Object.assign(req.query)
  const api = '/sign/outsignquery'

  callApi(query, api, res, req)
})
/* 外勤详情 */
router.get('/sign/outsign_details', function (req, res, next) {
  // exportUrl = null
  const query = Object.assign(req.query)
  const api = '/sign/outsign_details'

  callApi(query, api, res, req)
})


export default router
