import {Product} from "../models/productModel.js"
import {query} from "express";
import { uploadOnCloudinary } from "../middleware/cloudinaryConfig.js"

//Filter ,sorting and pagination


    class APIfeatures {
        constructor(query, queryString) {
            this.query = query;
            this.queryString = queryString;
        }

        filtering() {
            const queryObj = { ...this.queryString };
            console.log("queryObj is", queryObj);
    
            const excludedFields = ['page', 'sort', 'limit'];
            excludedFields.forEach(el => delete queryObj[el]);
    
            // Handle category filtering
            if (queryObj.category && queryObj.category!=='') {
                this.query = this.query.where('category').equals(queryObj.category);
            }
    
            // Convert remaining queryObj to JSON and prefix operators
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);
    
            this.query.find(JSON.parse(queryStr));
            return this;
        }
    sorting(){
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join('')
            console.log(sortBy)
            this.query=this.query.sort(sortBy)
            
        }
        else{
            this.query=this.query.sort('-createdAt')
        }
        return this


    }
    pagination(){
        const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;

    }
}

export const productCtrl={
    getProduct:async(req,res)=>{
        try{
            
            const features=new APIfeatures(Product.find(),req.query)
            .filtering()
            .sorting()
            .pagination();
           
            const products = await features.query;
            const totalProducts = await Product.countDocuments();
            res.json({status:'success',result: totalProducts,product:products})
             

        }catch(err){
            console.error("Error in getProduct:", err);
            return res.status(500).json({msg:err.message})
        }
            
    },


    

    createProduct:async(req,res)=>{
        try{

            console.log("Create product is running")

            const {product_id,title,price,description,content,category}=req.body

            const imageLocalPath=req.files?.images[0]?.path;

            if(!imageLocalPath)
                {

                    console.log("local image path not found in createproduct backend")
                   return res.json({msg:"Image local path is required "})
                }
                const image=await uploadOnCloudinary(imageLocalPath)
                

                if(!image)
                {

                    console.log("image not not uploaded on cloudinary ")
                     return res.json("image not uploaded on cloudinary")
                }

                console.log("image url created successfully")

            const product=await Product.findOne({product_id})
            if(product) return res.status(400).json({msg:"This product already exists"})

            const newProduct =new Product({product_id,title:title.toLowerCase(),price:Number(price),description,content,images:image.url,category})
            await newProduct.save()

            res.json(newProduct)

            console.log("create product executed successfully")



        }catch(err){
            return res.status(500).json({msg:err.message})

        }

    },

    deleteProduct:async(req,res)=>{
        try{


            const product=await Product.findByIdAndDelete({_id:req.params.id})
            res.json("Product deleted successfully")

        }catch(err){
            return res.status(500).json({msg:err.message})

        }
    },

    updateProduct:async(req,res)=>{
        try{

            const {product_id,title,price,description,content,category}=req.body

            const imageLocalPath=req.files?.images[0]?.path;

            if(!imageLocalPath)
                {
                   return res.json({msg:"Image local path is required "})
                }
                const image=await uploadOnCloudinary(imageLocalPath)
                console.log(image)

                if(!image)
                {
                     return res.json("image not uploaded on cloudinary")
                }

            await Product.findByIdAndUpdate({_id:req.params.id},{product_id,title,price:Number(price),description,content,images:image.url,category})
            res.json("Product  updated successfully")
           

        }catch(err){
            return res.status(500).json({msg:err.message})

        }
    }
}