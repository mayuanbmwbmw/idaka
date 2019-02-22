import {Router} from 'express'
import axios from 'axios'
import qs from 'qs'
import bodyParser from 'body-parser'

// import store from '../../store'
// console.log(store.state.login.userInfo.uid)
// let bodyParser = require('body-parser')

const router = Router()
// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({extended: false}))

const multer = require('multer')
// const FormData = require('form-data')
const fs = require('fs')

const baseUrl = process.env.SERVER

// 删除服务端文件夹
const deleteFolder = function (path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
// 创建目录
if (!fs.existsSync('uploadFiles')){
  fs.mkdir('uploadFiles', function (err) {
    if (err) return console.error(err)
    console.log('目录创建成功')
  })
}

// 公共api
const callApi = (query, api, res) => {
  // console.log('---------------------------', query)
  return axios.post(baseUrl + api, qs.stringify(query)).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    res.json(err.status)
  })
}
// 下载专用
const downloadApi = (query, api, res) => {
  return axios.get(baseUrl + api, {params: query}).then((response) => {
    // return axios.post(baseUrl + api, qs.stringify(query)).then((response) => {
    console.log('-----------------------------------', {params: query})
    res.json(response.data)
  }).catch((err) => {
    res.json(err.status)
  })
}
// 上传专用
const uploadApi = (query, api, res) => {
  console.log('-----------------------------------', query)
  console.log('-----------------------------------', baseUrl + api)
  // return axios.post(baseUrl + api, qs.stringify(query), {headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
  return axios.post(baseUrl + api, qs.stringify(query)).then((response) => {
    response.data.filename = query.filename
    res.json(response.data)
    if (response.data.code === 0) {
      // 删除文件
      fs.unlink(`uploadFiles/${query.filename}`, function () {
        console.info('成功删除文件', `uploadFiles/${query.filename}`)
      })
    }
  }).catch((err) => {
    err.status.filename = query.filename
    res.json(err.status)
  })
}

// 员工审核
router.get('/employee_manage/employee_verify', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/employee_verify'
  callApi(query, api, res)
})

// 进行审核
router.get('/employee_manage/check_employee', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/check_employee'
  callApi(query, api, res)
})

/* 部门信息 */
router.get('/employee_manage/department_manage', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/department_manage'
  callApi(query, api, res)
})

// 部门编辑
router.get('/employee_manage/submit_depart_change', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/submit_depart_change'
  callApi(query, api, res)
})

// 部门重命名
router.get('/employee_manage/department_rename', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/department_rename'
  callApi(query, api, res)
})

// 部门移除
router.get('/employee_manage/department_delete', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/department_delete'
  callApi(query, api, res)
})

// 添加部门-获取人员信息
router.get('/employee_manage/employee_info', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/employee_info'
  callApi(query, api, res)
})

// 添加部门-提交添加结果
router.get('/employee_manage/newdepartment_add', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/newdepartment_add'
  callApi(query, api, res)
})

// 员工详情
// router.get('/employee_manage/employee_info', function (req, res, next) {
//   const query = Object.assign(req.query)
//   const api = '/employee_manage/employee_info'
//   callApi(query, api, res)
// })

// 员工转移
router.get('/employee_manage/employee_changedepartment', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/employee_changedepartment'
  callApi(query, api, res)
})

// 员工离职
router.get('/employee_manage/employee_delete', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/employee_quit'
  callApi(query, api, res)
})

// 员工修改
router.get('/employee_manage/employee_info_change', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/employee_info_change'
  callApi(query, api, res)
})

// 6.6.0

// 导入模板下载接口
// user_id	是	string	用户id
router.get('/employee_manage/download_template', function (req, res, next) {
  const query = req.query
  const api = '/employee_manage/download_template'
  downloadApi(query, api, res)
})
router.get('/employee_manage/download_addressbook', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/download_addressbook'
  downloadApi(query, api, res)
})

// 预加入成员表导入接口
// let upload = multer({dest: 'uploadFiles/'}).single('file')
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploadFiles/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Math.random().toString(36).substr(2)}${file.originalname}`)
  }
})
let upload = multer({storage: storage}).single('file')
// var jsonParser = bodyParser.json()
// var multipart = require('connect-multiparty')
// var multipartMiddleware = multipart()
// 创建 application/x-www-form-urlencoded 解析
// var urlencodedParser = bodyParser.urlencoded({extended: false})
router.post('/employee_manage/upload_sheet', upload, function (req, res, next) {
// router.post('/employee_manage/upload_sheet', multipartMiddleware, function (req, res, next) {
  // console.log(req)
  // req.headers['content-type'] = 'multipart/form-data'
  // console.info('----------------------------------------------', req.body)
  // console.info('----------------------------------------------', req.params)
  console.info('----------------------------------------------', req.file)
  // const file = req.files.file
  const user_id = req.body.user_id
  const query_token = req.body.query_token
  const file = req.file

  //  请求路径
  // var url = baseUrl + '/employee_manage/upload_sheet'

  /* 上传文件 */
  upload(req, res, function (err) {
    console.log('url', req.url)
    if (err) {
      console.log('上传失败')
    } else {
      console.log('上传成功')
      // 反馈上传信息
      // res.send({
      //   'states': 'success',
      //   file
      // })
      const api = '/employee_manage/upload_sheet'
      // let formData = new FormData()
      // formData.append('user_id', req.body.user_id)
      // formData.append('query_token', req.body.query_token)
      // formData.append('file', fs.createReadStream('uploads/' + req.file.originalname))
      // formData.append('file', req.files)
      let formData = {
        user_id,
        query_token,
        filename: file.filename
      }
      uploadApi(formData, api, res)
    }
  })

  // let form = new FormData()
  // form.append('user_id', req.body.user_id)
  // form.append('query_token', req.body.query_token)
  // form.append('file', fs.createReadStream(req.files.file.path))
  //
  // let getHeaders = (form => {
  //   return new Promise((resolve, reject) => {
  //     form.getLength((err, length) => {
  //       if (err) reject(err)
  //       let headers = Object.assign({'Content-Length': length}, form.getHeaders())
  //       resolve(headers)
  //     })
  //   })
  // })
  //
  // getHeaders(form)
  //   .then(headers => {
  //     return axios.post(url, form, {headers: headers})
  //   })
  //   .then((response) => {
  //     console.log('成功哦', response.data)
  //   })
  //   .catch(e => {
  //     console.log('失败哦', e)
  //   })
})

// 文件上传进度查询接口
// query_token	是	string	请求token
router.get('/employee_manage/upload_percent', function (req, res, next) {
  const query = req.query
  const api = '/employee_manage/upload_percent'
  callApi(query, api, res)
})

// 企业通讯录导出接口
// user_id	是	string	用户id
// query_token	是	string	请求token
router.get('/employee_manage/export_enterprise_addressbook', function (req, res, next) {
  const query = req.query
  const api = '/employee_manage/export_enterprise_addressbook'
  callApi(query, api, res)
})

// 返回企业通讯录导出进度
// query_token	是	string	请求token
router.get('/employee_manage/export_enterprise_addressbook2', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/export_enterprise_addressbook2'
  callApi(query, api, res)
})

// 通讯录文件上传接口
// query_token	是	string	请求token
router.post('/employee_manage/upload_addressbook', upload, function (req, res, next) {
  console.info('----------------------------------------------', req.file)
  const user_id = req.body.user_id
  const query_token = req.body.query_token
  const file = req.file
  //  请求路径
  // var url = baseUrl + '/employee_manage/upload_addressbook'
  // req.url = url
  upload(req, res, function (err) {
    console.log('url', req.url)
    if (err) {
      console.log('上传失败')
    } else {
      console.log('上传成功')
      // 反馈上传信息
      // res.send({
      //   'states': 'success',
      //   file
      // })
      const api = '/employee_manage/upload_addressbook'
      let formData = {
        user_id,
        query_token,
        filename: file.filename
      }
      uploadApi(formData, api, res)
    }
  })
})

// 返回企业通讯录上传进度
// query_token	是	string	请求token
router.get('/employee_manage/addressbook_download_percent', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/addressbook_download_percent'
  callApi(query, api, res)
})

// 上传结果
router.get('/employee_manage/upload_result', function (req, res, next) {
  const query = Object.assign(req.query)
  const api = '/employee_manage/upload_result'
  callApi(query, api, res)
})
export default router
