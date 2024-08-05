import { Category } from "../models/categoryModel.js"

export const categoryCtrl={

    getCategory:async(req,res)=>{
      try{

            const categories=await Category.find()
            console.log("categories are ")
            console.log(categories)
            res.json({categories})
             

        }catch(err){
            return res.status(500).json({msg:err.message})
        }  
    },

    createCategory:async(req,res)=>{
        try{

            const {name} =req.body

            const category=await Category.findOne({name})
            if(category) return res.status(400).json({msg:"Category Already present"})

             const newCategory= new Category({name})
             await newCategory.save()

            res.json("Category created successfully")
        }catch(err){
            return res.status.json({msg:err.message})
        }


    },

    deleteCategory:async(req,res)=>{
        try{
            await Category.findByIdAndDelete({_id:req.params.id})
            res.json("Delete a category")

        }catch(err){
            return res.status(500).json({msg:err.message})
        }

    },

    updateCategory:async(req,res)=>{
        try{
            const {name}=req.body
            await Category.findByIdAndUpdate({_id:req.params.id},{name})
            res.json("Category updated successfully")
            
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    }

}