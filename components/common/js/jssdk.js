import $ from 'jquery'
import { BASE_URL, WX_APP_ID } from '../../../constants'

function RandomString(length) {
  let str = ''
  for (; str.length < length; str += Math.random().toString(36).substr(2));
  return str.substr(0, length)
}
function weChatConfig(wechatTime, wechatNonce, wechatSignature) {
  // 微信配置
  window.wx.config({
    debug: false,
    appId: WX_APP_ID,
    timestamp: wechatTime,
    nonceStr: wechatNonce,
    signature: wechatSignature,
    jsApiList: [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'onVoicePlayEnd',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard',
    ], // 功能列表，我们要使用JS-SDK的什么功能
  })
}
/*
 *  微信配置函数
 *  @param {function} 微信ready后的回调函数
 *  @param {any} 微信ready后回调函数接收的参数
 *  @param {array} 需要使用的微信api列表
*/
export const wxConfig = () => {
  let flag = false
  return (callback, params) => {
    if (flag === true) {
      return
    }
    console.info('wx config start')
    const time = new Date().getTime()
    const nonce = RandomString(24)
    const signUri = window.location.href.split('#')[0]
    $.ajax({
      method: 'GET',
      url: `${BASE_URL}/aibao_meta/wx/pcapi/v1/jsapi/signature/`,
      data: { timestamp: time, nonce, sign_uri: signUri },
      success: (data) => {
        console.info(data)
        console.info('apply jsapi signature succ')
        if (data) {
          weChatConfig(time, nonce, data)
          window.wx.ready(() => {
            console.info('wx already')
            console.info('wx config callback', callback)
            callback && (params ? callback(params) : callback())
          })
        }
      },
      error: (err) => {
        console.info('wxConfig apply signature error!', err)
      },
    })
    flag = true
  }
}


/*
 * 用于创建一个使用微信接口的图片对象
 * @return {object}
 *    choose:调用选择图片API
 *      @param {number}  选择图片的数量限制，任何参数都不填默认9张
 *      @param {function} 成功选择完图片后的回调，回调函数回传图片列表的localIds
 *    preview:调用图片预览API
 *      @param {array}  需要预览的图片数组列表
 *      @param {string}  当前显示的图片地址，不填默认为图片列表第一张（可选）
 *    upload:上传图片到微信服务器
 *      @param {array}  需要上传到微信服务器的localId数组列表
 *      @return {Promise} 返回的Promise对象，
 *            resolved状态接收serverId列表，
 *            列表元素为{localId:localId,serverId:serverId}的形式：包含localId和serverId键值对的对象
 *    download:下载微信服务器的图片到本地
 *      @param {array}  需要下载到本地的微信服务器serverId数组列表
 *      @return {Promise} 返回的Promise对象，
 *            resolved状态接收serverId列表，
 *            列表元素为{localId:localId,serverId:serverId}的形式：包含localId和serverId键值对的对象
 *
 *
*/
export function WXImage() {
  return {
    choose: (limit, callback) => {
      window.wx.chooseImage({
        count: limit || 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          console.info('choose image succ,res=', res)
          const localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          callback && callback(localIds)
        },
      })
      return ''
    },
    preview: (imgList, currentImg) => {
      if (imgList && !imgList.length) {
        console.info('wx preview list is empty')
        return false
      }
      const currentImgSrc = currentImg || imgList[0]
      window.wx.previewImage({
        current: currentImgSrc, // 当前显示图片的http链接
        urls: imgList, // 需要预览的图片http链接列表
      })
      return ''
    },
    upload: (localIdList) => {
      const uploadPromise = new Promise((uploadResolve, uploadReject) => {
        const asyncUploadImg = (list, index, serverIdList) => {
          const tempServerList = serverIdList.slice(0)
          if (index === list.length) {
            console.info('[upload jssdk] all images had uploaded', tempServerList)
            uploadResolve(tempServerList)
          } else {
            window.wx.uploadImage({
              localId: list[index], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 0, // 默认为1，显示进度提示
              success: (res) => {
                console.info('uploadDefersuccess')
                console.info('[upload jssdk] this image had uploaded', list[index])
                const serverId = res.serverId // 返回图片的服务器端 ID
                tempServerList.push({
                  localId: list[index],
                  serverId,
                })
                asyncUploadImg(list, index + 1, tempServerList)
              },
              error: (error) => {
                console.info('uploadDefererror')
                uploadReject(error)
              },
            })
          }
        }
        asyncUploadImg(localIdList, 0, [])
      })
      return uploadPromise
    },
    download: (serverIdList) => {
      const downloadPromise = new Promise((downloadResolve, downloadReject) => {
        const downloadDefer = (serverId) => {
          const promise = new Promise((resolve, reject) => {
            console.info('promise,', serverId)
            window.wx.downloadImage({
              serverId, // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 0, // 默认为1，显示进度提示
              success: (res) => {
                console.info('download img succ,', res)
                const localId = res.localId // 返回图片的服务器端 ID
                resolve({
                  localId,
                  serverId,
                })
              },
              fail: (error) => {
                console.info('download img err,', error)
                reject(error)
              },
            })
          })
          return promise
        }
        async function asyncDownload(newServerIdList) {
          const localIdList = []
          for (let i = 0; i < newServerIdList.length; i += 1) {
            const newLocalId = downloadDefer(newServerIdList[i])
              .then(
                res => res,
                (err) => {
                  console.info('download img err', err)
                },
              )
              .catch((err) => {
                console.info('async dowload img err', err)
              })
            localIdList.push(newLocalId)
          }
          const results = await Promise.all(localIdList)
          return results
        }
        asyncDownload(serverIdList)
          .then(
              (msg) => {
                console.info('asyncdownload img resolve,', msg)
                downloadResolve(msg)
              },
              (err) => {
                console.info('asyncdownload img rejected,', err)
                downloadReject(err)
              },
            )
      })
      return downloadPromise
    },
  }
}
/*
 * 用于创建一个使用微信接口的录音对象
 * @return {object}
 *    start:开始录音
 *    stop:停止录音
 *      @param? {function} 录音成功的回调函数
 *      @return {number/string} 录音结束后的localId或者error字段
 *    timeout: 录音超时1分钟后监听事件
 *      @param? {function} 录音成功的回调函数
 *      @return {number/string} 录音结束后的localId或者error字段
 *    upload:上传录音到微信服务器
 *      @param {array}  需要上传到微信服务器的localId数组列表
 *      @return {Promise} 返回的Promise对象，
 *            resolved状态接收serverId列表，
 *            列表元素为{localId:localId,serverId:serverId}的形式：包含localId和serverId键值对的对象
 *
*/
export function WXRecord() {
  wxConfig()
  return {
    start: (callback) => {
      console.info('start record')
      window.wx.startRecord({
        success: () => {
          console.info('开始录音')
          callback && callback()
        },
        error: () => {
          console.info('开始录音失败')
        },
        cancel: () => {
          console.info('用户拒绝授权录音')
        },
      })
    },
    stop: (callback) => {
      console.info('stopping record')
      return window.wx.stopRecord({
        success: (res) => {
          console.info('stop record', res)
          const localId = res.localId
          callback && (typeof callback === 'function') && callback(localId)
          return localId
        },
        error: () => 'error',
      })
    },
    timeout: callback => window.wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      success: (res) => {
        const localId = res.localId
        callback && (typeof callback === 'function') && callback(localId)
        return localId
      },
      error: () => 'error',
      complete: (res) => {
        const localId = res.localId
        console.info('record timeout,localId=', localId)
      },
    }),
    upload: (localIdList) => {
      const uploadPromise = new Promise((uploadResolve, uploadReject) => {
        const asyncUploadRecord = (list, index, serverIdList) => {
          const tempServerList = serverIdList.slice(0)
          if (index === list.length) {
            console.info('[upload jssdk] all records had uploaded', tempServerList)
            uploadResolve(tempServerList)
          } else {
            window.wx.uploadVoice({
              localId: list[index], // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 0, // 默认为1，显示进度提示
              success: (res) => {
                console.info('[upload jssdk] this record had uploaded', list[index])
                const serverId = res.serverId // 返回图片的服务器端 ID
                tempServerList.push({
                  localId: list[index],
                  serverId,
                })
                asyncUploadRecord(list, index + 1, tempServerList)
              },
              error: (error) => {
                uploadReject(error)
              },
            })
          }
        }
        asyncUploadRecord(localIdList, 0, [])
      })
      return uploadPromise
    },
  }
}
/*
 * 用于创建一个使用微信接口的音频对象
 * @return {object}
 *    play: 开始播放
 *      @param {number} 从WXRecord的stop/timeout获得的localId
 *    stop: 暂停播放
 *      @param {number} 从WXRecord的stop/timeout获得的localId
 *    stop: 停止播放
 *      @param {number} 从WXRecord的stop/timeout获得的localId
 *    end: 监听播放结束事件
 *      @param? {function} 播放结束后执行的回调函数
 *      @return {number} 返回音频的本地ID
 *    download:下载微信服务器的音频到本地
 *      @param {array}  需要下载到本地的微信服务器serverId数组列表
 *      @return {Promise} 返回的Promise对象，
 *            resolved状态接收serverId列表，
 *            列表元素为{localId:localId,serverId:serverId}的形式：包含localId和serverId键值对的对象
 *
*/
export function WXVoice() {
  wxConfig()
  return {
    play: (id) => {
      if (!id || (typeof id !== 'string')) {
        console.info('play id is invalid')
        return
      }
      window.wx.playVoice({
        localId: id,
        success: () => {
          console.info(`play audio success:localId=${id}`)
        },
        error: () => {
          console.info(`play audio fail:localId=${id}`)
        },
      })
    },
    pause: (id) => {
      if (!id || (typeof id !== 'string')) {
        console.info('play id is invalid')
        return
      }
      window.wx.pauseVoice({
        localId: id,
      })
    },
    stop: (id) => {
      if (!id || (typeof id !== 'string')) {
        console.info('play id is invalid')
        return
      }
      window.wx.stopVoice({
        localId: id,
        success: () => {
          console.info(`stop audio success:localId=${id}`)
        },
        error: () => {
          console.info(`stop audio fail:localId=${id}`)
        },
      })
    },
    end: (callback) => {
      window.wx.onVoicePlayEnd({
        success: (res) => {
          const localId = res.localId
          callback && (typeof callback === 'function') && callback(localId)
          return localId
        },
      })
    },
    dowload: (serverIdList) => {
      const downloadPromise = new Promise((downloadResolve, downloadReject) => {
        const downloadDefer = (serverId) => {
          const promise = new Promise((resolve, reject) => {
            window.wx.downloadVoice({
              serverId, // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 0, // 默认为1，显示进度提示
              success: (res) => {
                const localId = res.localId // 返回图片的服务器端 ID
                resolve({
                  localId,
                  serverId,
                })
              },
              error: (error) => {
                reject(error)
              },
            })
          })
          return promise
        }
        async function asyncDownload(newServerIdList) {
          const localIdList = []
          for (let i = 0; i < newServerIdList.length; i += 1) {
            const newLocalId = downloadDefer(newServerIdList[i])
                                      .then(
                                        res => res,
                                        (err) => {
                                          console.info('download img err', err)
                                        },
                                      )
                                      .catch((err) => {
                                        console.info('asyncDownload voice catch err', err)
                                      })
            localIdList.push(newLocalId)
          }
          const results = await Promise.all(localIdList)
          return results
        }
        asyncDownload(serverIdList)
          .then(
              (msg) => {
                console.info('asyncdownload voice resolve,', msg)
                downloadResolve(msg)
              },
              (err) => {
                console.info('asyncdownload voice rejected,', err)
                downloadReject(err)
              },
            )
      })
      return downloadPromise
    },
  }
}
/*
 * 用于创建一个使用微信接口的菜单控制对象
 *  @return {object}
 *      show: 显示功能按钮
 *        @param? {array/string} 数组或者字符串all，不填默认显示全部
 *      hide: 隐藏功能按钮
 *        @param? {array/string} 数组或者字符串all，不填默认显示全部
*/
export function WXMenu() {
  return {
    show: (menuList) => {
      if (menuList === 'all' || menuList === undefined) {
        wxConfig(window.wx.showAllNonBaseMenuItem)
      } else if (menuList instanceof Array) {
        wxConfig(window.wx.showMenuItems, {
          MenusList: [...menuList],
        })
      }
    },
    hide: (menuList) => {
      console.info('menulist', menuList)
      if (menuList === 'all' || menuList === undefined) {
        console.info('will hide menu')
        wxConfig(window.wx.hideAllNonBaseMenuItem, {
          success: (e) => {
            console.info(e)
            console.info('hide all succ')
          },
          error: (e) => {
            console.info('hide all failed', e)
          },
        })
        window.wx.hideAllNonBaseMenuItem({
          success: (e) => {
            console.info(e)
            console.info('hide all succ')
          },
          error: (e) => {
            console.info('hide all failed', e)
          },
        })
      } else if (menuList instanceof Array) {
        console.info('wx menu list', menuList)
        wxConfig(window.wx.hideMenuItems, {
          MenusList: [...menuList],
          success: (e) => {
            console.info('hide menu succ', e)
          },
          error: (e) => {
            console.info('hide menu error', e)
          },
          complete: () => {
            console.info('hide menu complete')
          },
        })
      }
    },
  }
}
/*
 * 用于创建一个使用微信接口的分享对象
 *  @return {object}
 *      share: 分享功能函数
 *        @param? {object} 分享所需参数
 *          {
 *            title {string}  分享的标题
 *            link {string}  分享的链接
 *            imgUrl {string}  分享的图标地址
 *            desc {string}  分享描述
 *            success? {function}  分享成功的回调（可选）
 *            cancel? {function}  取消分享的回调（可选）
 *          }
*/
export function WXShare() {
  return {
    share: (params) => {
      console.info('wxshare')
      if (!params) {
        return false
      }
      function shareConfig(shareParams) {
        console.info('share config')
        const { title, link, imgUrl, desc, success, cancel } = shareParams
        console.info('shareParams', shareParams)
        if (!title || !link || !imgUrl) {
          return false
        }
        console.info('will menu share time line')
        window.wx.onMenuShareTimeline({
          title, // 分享标题
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          success: () => {
            // 用户确认分享后执行的回调函数
            success && success()
            console.info('success')
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
            cancel && cancel()
            console.info('cancel')
          },
          complete: () => {
            console.info('share complete')
          },
        })
        window.wx.onMenuShareAppMessage({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: () => {
            // 用户确认分享后执行的回调函数
            success && success()
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
            cancel && cancel()
          },
        })
        window.wx.onMenuShareQQ({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          success: () => {
            // 用户确认分享后执行的回调函数
            success && success()
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
            cancel && cancel()
          },
        })
        window.wx.onMenuShareWeibo({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          success: () => {
            // 用户确认分享后执行的回调函数
            success && success()
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
            cancel && cancel()
          },
        })
        window.wx.onMenuShareQZone({
          title, // 分享标题
          desc, // 分享描述
          link, // 分享链接
          imgUrl, // 分享图标
          success: () => {
            // 用户确认分享后执行的回调函数
            success && success()
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
            cancel && cancel()
          },
        })
        return ''
      }
      console.info(wxConfig(shareConfig, params)(shareConfig, params))
      return ''
    },
  }
}
export function WXPay() {
  wxConfig()
  return {
    pay: (params) => {
      console.info('wx pay params', params)
      const payPromise = new Promise((payResolve, payReject) => {
        window.wx.chooseWXPay({
          // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          timestamp: params.timeStamp,
          // 支付签名随机串，不长于 32 位
          nonceStr: params.nonceStr,
          // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          package: params.package,
          // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          signType: params.signType,
          // 支付签名
          paySign: params.paySign,
          success: (res) => {
            // 支付接口调用成功
            if (res.errMsg === 'chooseWXPay:ok') {
              // 用户支付成功
              console.info('用户支付成功', res)
              return payResolve(res)
            }
            // 用户支付失败
            console.error('用户支付失败', res)
            return payReject(res)
          },
          cancel: (cancel) => {
            // 支付接口调用取消
            console.info('支付接口调用取消', cancel)
            return payReject(cancel)
          },
          fail: (err) => {
            // 支付接口调用失败
            console.error('支付接口调用失败', err)
            return payReject(err)
          },
          complete: () => {
            console.info('chooseWXPay complete')
          },
        })
      })
      return payPromise
    },
  }
}
