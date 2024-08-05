import express from 'express'
import { catCtrl } from "../controllers/catCtrl.js"

const router = express.Router()

router.get('/categories',catCtrl.getCategories)


export default router