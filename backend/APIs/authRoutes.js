import exp from 'express';
import {hash,compare} from 'bcryptjs'
import {userModel} from '../models/userModel.js'
import jwt from 'jsonwebtoken'

const authApp=exp.Router()
const {sign}=jwt

//body parser middleware
authApp.use(exp.json())

//route for registration
authApp.post('/register',async(req,res,next)=>{
    try{
        let allowedRoles=['TRADER']
        const {name,email,password,role}=req.body
        //check if role is valid
        if(!allowedRoles.includes(role)){
            return res.status(400).json({message:'Invalid role'})
        }
        //check if user already exists
        const user=await userModel.findOne({email})
        if(user){
            return res.status(400).json({message:'User already exists'})
        }
        //hash password
        const hashedPassword=await hash(password,12)
        const newUserDocument=new userModel({name,email,password:hashedPassword,role})
        await newUserDocument.save()
        return res.status(201).json({message:'User created successfully'})
    }
    catch(err){
        console.log("Registration error:", err.message)
        next(err)
    }
});

//route for login
authApp.post('/login',async(req,res,next)=>{
    try{
        // check if user exists
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:'User not found'})
        }

        //check if user is blocked
        if(user.status === 'blocked'){
            return res.status(403).json({message:'Your account has been blocked. Contact admin.'})
        }
          //check if password is correct
        const isPasswordValid=await compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({message:'Invalid password'})
        }

        //include userId in token so it can be extracted in protected routes
        const token=sign(
            {userId:user._id, email:user.email, role:user.role},
            process.env.SECRET_KEY,
            {expiresIn:'24h'}
        )
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        });

        //update login tracking
        user.isLoggedIn = true
        user.lastLogin = new Date()
        await user.save()

        return res.status(200).json({
            message:'Login successful',
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                balance:user.balance
            }
        })
    }
    catch(err){
        console.log("Login error:", err.message)
        next(err)
    }
})

//route for logout
authApp.get('/logout',async(req,res,next)=>{
    try{
        //try to  update isLoggedIn if token is valid
        try{
            const token = req.cookies?.token
            if(token){
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                await userModel.findByIdAndUpdate(decoded.userId, {isLoggedIn: false})
            }
        }catch(e){
            //token might be expired/invalid, still allow logout 
            console.log(e) 
        }

        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        });
        return res.status(200).json({message:'Logout successful'})
    } 
    //catch if token is invalid
    catch(err){
        console.log("Logout error:", err.message)
        next(err)
    }
})

// route to get current user data from token
import { verifyToken } from '../middlewares/verifyToken.js'
authApp.get('/me', verifyToken('TRADER', 'ADMIN'), async(req, res) => {
    try { 
        // check if user exists
        const user = await userModel.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } 
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
});

export default authApp;