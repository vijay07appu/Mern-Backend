import express from 'express'

import { razorCtrl } from '../controllers/razorCtrl.js'

const router = express.Router()

router.post('/create-order',razorCtrl.createorder)


export default router