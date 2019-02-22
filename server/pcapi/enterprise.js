import { Router } from 'express'
import axios from '../../plugins/axios'
import qs from 'querystring'

const router = Router()
const baseUrl = process.env.SERVER
// const phone = {d: 'WAP'}

// 公共api
const callApi = (query, api, res, req) => {
  return axios.post(baseUrl + api, qs.stringify(query)).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    res.json(err.status)
  })
}

/* 企业管理-信息获取接口 */
router.get('/get_enterprise_info', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/enterprise/get_enterprise_info'

  callApi(query, api, res, req)
})

/* 企业管理-修改企业信息 */
router.get('/change_enterprise_info', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/enterprise/change_enterprise_info'

  callApi(query, api, res, req)
})

/* 企业管理-注销企业 */
router.get('/delete_enterprise', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/enterprise/delete_enterprise'

  callApi(query, api, res, req)
})

export default router
