import { Router } from 'express'
import axios from '../../plugins/axios'
import qs from 'querystring'

const router = Router()
const baseUrl = process.env.SERVER
// const enterpriseId = {enterprise_id: 1}

// 公共api
const callApi = (query, api, res, req = '') => {
  return axios.post(baseUrl + api, qs.stringify(query)).then((response) => {
    if (response.data.code === 0) {
      const userInfo = response.data.data
      if (userInfo) {
        req.session.userInfo = userInfo
      }
      res.json(response.data)
    } else {
      res.json(response.data)
    }
  }).catch((err) => {
    res.json(err.status)
  })
}

/* 点击发送验证码 */
router.get('/user/getvcode', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/getvcode'

  callApi(query, api, res)
})

/* 注册 */
router.get('/user/register', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/register'

  callApi(query, api, res)
})

/* 登录 */
router.get('/user/login', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/login'
  callApi(query, api, res, req)
})

/* 扫码登录 轮询 */
router.get('/user/qr_login_web', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/qr_login_web'

  callApi(query, api, res, req)
})

/* 扫码登录初始化 */
router.get('/user/qr_login_initial', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/qr_login_initial'

  callApi(query, api, res, req)
})

/* 忘记密码 */
router.get('/user/forgotpassword', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/forgotpassword'

  callApi(query, api, res)
})
/* 修改密码 */
router.get('/user/changepassword', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/changepassword'

  callApi(query, api, res)
})

/* 获得 session token */
router.get('/getToken', function (req, res, next) {
  const userInfo = req.session.userInfo
  if (userInfo) {
    res.json(true)
  } else {
    res.json(false)
  }
})

/* 登出 */
router.get('/logout', function (req, res, next) {
  delete req.session.userInfo
  res.json(200)
})

// 渠道
router.get('/user_manage/rememberwhocamehere', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/user_manage/rememberwhocamehere'

  callApi(query, api, res)
})

export default router
