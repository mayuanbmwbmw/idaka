import { deviceType } from '~/utils/deviceType'
export default function ({ context, route, req, redirect }) {
  // @ts-ignore
  let userAgent = process.server
    ? req.headers['user-agent']
    : navigator.userAgent
  // 给全局上下文添加一个属性来保存我们返回的匹配信息
  let device = deviceType(userAgent)
  // 这里注入到store,是因为我部分页面需要判断机型请求不同的数据,
  // 你们没有用到的话可以移除
  // context.store.commit('SetDeviceType', context.deviceType)

  // 若是判断UA非移动端的,就在这里做处理了..
  // context.redirect(status,url) 这个可以重定向到外部网站
  // 若是内部访问可以直接用router对象push
  if (device.type !== 'pc') {
    redirect('/mobile')
  } else if (device.type === 'pc' && route.path === '/mobile') {
    redirect('/')
  }
}
