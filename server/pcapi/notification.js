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

/* 发布通知-获取人员名单 */
router.get('/get_recivers', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/notice/get_recivers'

  callApi(query, api, res, req)
})

/* 发布通知 */
// router.get('/notice/publish_notification', function (req, res, next) {
//   console.info(req)
//
//   const query = Object.assign(req.query)
//   const api = '/notice/publish_notification'
//
//   callApi(query, api, res, req)
// })

router.post('/notice/publish_notification', function (req, res, next) {

  const query = Object.assign(req.query)
  const api = '/notice/publish_notification'
  console.info(123, req.body)
  callApi(query, api, res, req.body)
})
export default router
