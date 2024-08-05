
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'


import bcrypt from 'bcryptjs'

export const userCtrl = {
    register: async(req,res) => {
        try{
            const {name,email,password} = req.body;

            const user = await User.findOne({email})
            if(user) return res.status(400).json({msg:"Email Already Registered"})

            if(password.length < 6)
            return res.status(400).json({msg:"Password is at least 6 character"})

            // Password Encryption
            const passwordHash = await bcrypt.hash(password,10)

            const newUser = new User({
                name,email,password:passwordHash
            })

            //Save mongodb
            await newUser.save()

            //create jwt to authenticate
            const accesstoken = createAccessToken({id:newUser._id})
            const refreshtoken = createRefreshToken({id:newUser._id})
            console.log("refreshtoken is ")
            console.log(refreshtoken)
           

            res.cookie('refreshtoken', refreshtoken,{
                httpOnly:true,
                secure:true,
                sameSite:'None',
               
                path:'/api/user/refresh_token',
                expries:new Date(Date.now()+25892000000)
            })

            res.json({accesstoken})

        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    refreshtoken: async(req,res) => {

        try{
            const rf_token = req.cookies.refreshtoken;
           

            if(!rf_token) return res.status(400).json({msg:"Please Login or Registers , i am from cookie not found"});

            
    
            jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
                if(err) return res.status(400).json({msg:"Please Login or Register , i am checking"})
                const accesstoken = createAccessToken({id:user.id})
            res.json({accesstoken})
            })
    
        }
        catch(err){
return res.status(500).json({msg:err.message})
        }
       

    },
    login:async(req,res)=>{
        try{
            const {email,password} = req.body;

            const user = await User.findOne({email})
            if(!user) return res.status(400).json({msg:"User does not exist"})

            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({msg:"Incorrect Password"})
                console.log("user is ")
            console.log(user)

            const accesstoken = createAccessToken({id:user._id})
            const refreshtoken = createRefreshToken({id:user._id})
            

            res.cookie('refreshtoken',refreshtoken,{
                httpOnly:true,
                secure:true,
                sameSite:'None',
               
                path:'/api/user/refresh_token',
                expries:new Date(Date.now()+25892000000)
            })

            res.json({accesstoken})
        }catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    logout:async(req,res)=>{
        try{
            res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
            return res.json({msg:"Log Out"})
        }
        catch(err){

        }
    },
    getUser:async(req,res)=>{
        try{
            const user = await User.findById(req.user.id).select('-password')

            if(!user) return res.status(400).json({msg:"User Not Found"})
            res.json(user)
        }
        catch(err){
            return res.status(500).json({msg:err.message})
        }
    },
    addToCart: async (req, res) => {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' }); // Check if user is authenticated

            const { productId, quantity } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) return res.status(404).json({ message: 'User not found' });
            
            // Validate product
        //    const product = await Product.findById(productId);
        //    if (!product) return res.status(404).json({ message: 'Product not found' });


            await user.addToCart(productId, quantity);
            res.status(200).json({ message: 'Item added to cart' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    removeFromCart: async (req, res) => {
        try {
            if (!req.user) return res.status(401).json({ message: 'Unauthorized' }); // Check if user is authenticated

            const { productId } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) return res.status(404).json({ message: 'User not found' });

             // Validate product
        // const product = await Product.findById(productId);
        // if (!product) return res.status(404).json({ message: 'Product not found' });

            await user.removeFromCart(productId);
            res.status(200).json({ message: 'Item removed from cart' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserCart: async (req, res) => {
        try {
            if (!req.user) {
                return res.json([]); // Return empty cart if user is not logged in
            }

            const user = await User.findById(req.user.id).populate('cart.product');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


        // Filter out any items where the product is null
        const validCartItems = user.cart.filter(item => item.product !== null);

            res.json(validCartItems);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
    





const createAccessToken = (payload) => {
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'})
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
}

