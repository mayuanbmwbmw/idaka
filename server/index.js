import express from 'express'
import cookieParser from 'cookie-parser'
import { Nuxt, Builder } from 'nuxt'
import api from './pcapi'
import router from "./pcapi/department";
// import svgCaptcha from 'svg-captcha'
// import session from 'express-session'
const bodyParser = require('body-parser')
const session = require('express-session')
// var cookieParser = require('cookie-parser');
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 115200000 }
}))

const host = process.env.HOST || '127.0.0.1'
// const port = process.env.PORT || 3000
let port = ''
// app.use(cookieParser());
// app.use(session({
//     resave: true, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
//     secret: 'love'
// }))
app.use(cookieParser())
app.set('port', port)
// Import API Routes
app.use('/pcapi', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')

config.dev = !(process.env.NODE_ENV === 'production')
// Init Nuxt.js
const nuxt = new Nuxt(config)
// Build only in dev mode
if (config.dev) {
  port = process.env.PORT || 2009
  const builder = new Builder(nuxt)
  builder.build()
} else {
  port = process.env.PORT || 2009
}
// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
