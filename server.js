
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRouter.js'
import categoryRoute from './routes/categoryRouter.js'
import productRouter from './routes/productRouter.js'
import catRouter from './routes/catRouter.js'
import razorRouter from './routes/razorRouter.js'
import cors from "cors"

const app = express();
dotenv.config()
app.use(cors({
    origin:  'https://vijay-07-shoppi.netlify.app', // Update with your frontend URL
    credentials: true // Allow credentials (cookies) to be sent
}));
app.use(express.json())             
app.use(cookieParser())


const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.json({msg:"This is Example"})
})

app.listen(PORT,() => {
    console.log("SERVER IS RUNNING ...")
})

//Routes 
app.use('/api/user',userRouter)
app.use('/api',categoryRoute)
app.use('/api',productRouter)
app.use('/api',catRouter)
app.use('/api/payment',razorRouter)



//connect mongoDB

const URI = process.env.MONGODB_URL;


mongoose.connect(URI,{
    
}).then(()=>{
    console.log("MongoDB Connected")
}).catch(err => {
    console.log(err)
})
