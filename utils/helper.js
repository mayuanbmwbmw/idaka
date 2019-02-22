// import { Dialog } from 'vant'
// export const displayDialog = function (title, confirmText, link, that) {
//   return Dialog.confirm({
//     title: title,
//     message: '',
//     confirmButtonText: confirmText
//   }).then(() => {
//     that.$router.push(link)
//   }).catch(() => {
//     // on cancel
//   })
// }
import { MessageBox } from 'mint-ui'
export const displayDialog = function (title, confirmText, link, that) {
  return MessageBox.confirm({
    title: title,
    message: '',
    confirmButtonText: confirmText
  }).then(() => {
    that.$router.push(link)
  }).catch(() => {
    // on cancel
  })
}
// export const isHasImg = function (pathImg) {
//   var ImgObj = new Image()
//   ImgObj.src = pathImg
//   if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
//     return true
//   } else {
//     return false
//   }
// }
