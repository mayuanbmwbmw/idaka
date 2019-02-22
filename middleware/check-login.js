import axios from '~/plugins/axios'
import { Message } from 'element-ui'
// let path = ''
// let state = ''
export default async function ({ isClient, isServer, route, req, res, redirect, query, store }) {
  // 在服务端判读是否需要登陆(如果直接输地址，在客户端是判断不到的)
  // path = route.path
  let state = store.state
  let userInfo = store.state.login.userInfo
  const userId = userInfo && userInfo.uid
  let dailysign = await axios.get('/pcapi/employee_manage/employee_info', {
    params: {
      user_id: userId,
      employee_id: userId
    }
  })
  if (dailysign.data.code === -10) {
    if (isServer) {
      delete req.session.userInfo
    }
    if (isClient) {
      Message.error(dailysign.data.msg)
      store.dispatch('logout')
    }
    redirect('/')
  }
  // let state = store.state
  // if (isServer) {
  //   // const t = req.cookies ? req.cookies.token : ''
  //   const userInfo = req.session.userInfo
  //   if (!userInfo) redirect('/')
  // }
  // // 在客户端判读是否需要登陆
  // if (isClient) {
  //   let userInfo = await axios.get('/pcapi/getToken')
  //   const { data } = userInfo
  //   if (!data) {
  //     redirect('/')
  //     state.login.userInfo = null
  //   }
  // }
}
