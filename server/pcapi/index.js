import { Router } from 'express'

// import goLogin from './goLogin'
// import goJoin from './goJoin'
import authority from './authority'
import notification from './notification'
import enterprise from './enterprise'
import sign from './sign'
import department from './department'
import login from './login'
import ip from './ip'
const router = Router()

// Add USERS Routes
router.use(login, sign, enterprise, notification, authority, department, ip)
export default router
