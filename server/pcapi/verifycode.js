import { Router } from 'express'
import svgCaptcha from 'svg-captcha'

const router = Router()
// let baseURL = process.env.SERVER

// get
// {
//         params: {
//             pass: req.query.pass,
//             username: req.query.username
//         }
//     }

router.get('/vertifyImgCode', function (req, res, next) {
  var code = svgCaptcha.create({
    // 翻转颜色
    inverse: false,
    // 字体大小
    fontSize: 36,
    // 噪声线条数
    noise: 3,
    // 宽度
    width: 80,
    // 高度
    height: 30
  })

  var datas = {
    text: code.text.toLowerCase(),
    code: code.data
  }
  // code.text.toLowerCase()
  // code.data
  // console.info('datas', datas)
  res.json(datas)
})

export default router
