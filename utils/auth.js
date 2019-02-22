import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'

const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const extractInfoFromHash = () => {
  if (process.SERVER_BUILD) return
  const { idToken, state } = getQueryParams()
  return {
    token: idToken,
    secret: state
  }
}

// 设置Token
export const setToken = (token) => {
  console.info('token', token)
  if (process.SERVER_BUILD) return
  window.localStorage.setItem('token', token)
  window.localStorage.setItem('user', JSON.stringify(jwtDecode(token)))
  Cookie.set('jwt', token)
}

// 获取Token

// 清除Token
export const unsetToken = () => {
  if (process.SERVER_BUILD) return
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('secret')
  Cookie.remove('jwt')
  window.localStorage.setItem('logout', Date.now())
}

// 获取Cookie
export const getCookie = (req) => {
  console.info('req.h', req.headers['set-cookie'])
  if (!req.headers['set-cookie']) return
  const jwtCookie = (req.headers['set-cookie']).join(';').split(';')[0]
  if (!jwtCookie) return
  const jwt = jwtCookie.split('=')[1]
  return jwt
}

// 获取本地username
export const mobile = () => window.localStorage.getItem('mobile')

// 获取本地user
export const getUserFromLocalStorage = () => {
  const json = window.localStorage.user
  return json ? JSON.parse(json) : undefined
}

export const setSecret = (secret) => window.localStorage.setItem('secret', secret)

export const checkSecret = (secret) => window.localStorage.secret === secret
