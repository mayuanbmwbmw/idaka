// alert()
// if (process.client) {
//   window.history.replaceState = window.history.replaceState || function () {}
// }
if (window.navigator.appName === 'Microsoft Internet Explorer' && parseInt(window.navigator.appVersion.split(';')[1].replace(/[ ]/g, '').replace('MSIE', '')) < 10) {
  window.history.replaceState = window.history.replaceState || function () {}
}