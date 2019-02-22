import { Router } from 'express'
import axios from '../../plugins/axios'
import qs from 'querystring'

const router = Router()
const baseUrl = process.env.SERVER
// const phone = {d: 'WAP'}

// 公共api
const callApi = (query, api, res) => {
  return axios.post(baseUrl + api, qs.stringify(query)).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    res.json(err.status)
  })
}

/* 权限信息获取 */
router.get('/authority', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/authority/authorities'

  callApi(query, api, res)
})

/* 进行权限控制 */
router.get('/authority/authority_list', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/authority/authority_list'

  callApi(query, api, res)
})

// 修改权限
router.get('/authority/authority_changed', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/authority/authority_changed'

  callApi(query, api, res)
})

/* 转让企业 */
router.get('/authority/authority_transfer', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/authority/authority_transfer'

  callApi(query, api, res)
})

export default router
