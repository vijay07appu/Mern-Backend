
import {userCtrl} from '../controllers/userCtrl.js'
import {auth} from '../middleware/auth.js'
import express from 'express'

const router = express.Router()


router.post('/register',userCtrl.register)

router.post('/login',userCtrl.login)

router.get('/logout',userCtrl.logout)

router.get('/refresh_token',userCtrl.refreshtoken)

router.get('/info',auth,userCtrl.getUser)

router.post('/add-to-cart',auth,userCtrl.addToCart)

router.post('/remove-from-cart',auth,userCtrl.removeFromCart)

router.get('/cart', auth,userCtrl.getUserCart);

 

export default router