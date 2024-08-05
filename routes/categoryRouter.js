import express from 'express'
import { categoryCtrl } from '../controllers/categoryCtrl.js';
import { auth } from '../middleware/auth.js';
import {authAdmin} from '../middleware/authAdmin.js'

const router=express.Router()


router.route('/category')
.post(auth,authAdmin,categoryCtrl.createCategory)
.get(categoryCtrl.getCategory)

router.route('/category/:id')
.delete(auth,authAdmin,categoryCtrl.deleteCategory)
.put(auth,authAdmin,categoryCtrl.updateCategory)




export default router;