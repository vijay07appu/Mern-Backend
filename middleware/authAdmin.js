import User from "../models/userModel.js"

export const authAdmin=async(req,res,next)=>{
    try{

        const user=await User.findOne({
            _id:req.user.id
        })
        if(user.role===0)
        {
            return res.status(400).json({msg:"Admin Resources Access Denied"})
        }
        console.log("authAdmin executed successfully")
        next()

    }catch(err)
    {
        return res.status(500).json({msg:err.message})

    }
}

