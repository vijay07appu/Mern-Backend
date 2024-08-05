import express from 'express'
import { productCtrl } from '../controllers/productCtrl.js'
import { upload } from '../middleware/multer.js'

const router=express.Router()


router.route('/products')

.get(productCtrl.getProduct)
.post(
    upload.fields([
        {
            name:"images",
            maxCount:1
        }])
    
    ,productCtrl.createProduct)

router.route('/products/:id')
.delete(productCtrl.deleteProduct)
.put(
    upload.fields([
        {
            name:"images",
            maxCount:1
        }]),

    productCtrl.updateProduct) 


export default router

