import exp from 'express';
import {hash,compare} from 'bcryptjs'
import {userModel} from '../models/userModel.js'
import jwt from 'jsonwebtoken'

const authApp=exp.Router()
const {sign}=jwt

//body parser middleware
authApp.use(exp.json())


authApp.post('/users',async(req,res,next)=>{
    try{
        let allowedRoles=['ADMIN','TRADER']
        const {name,email,password,role}=req.body
        if(!allowedRoles.includes(role)){
            return res.status(400).json({message:'Invalid role'})
        }
        const user=await userModel.findOne({email})
        if(user){
            return res.status(400).json({message:'User already exists'})
        }
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
        const {email,password}=req.body
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:'User not found'})
        }
        const isPasswordValid=await compare(password,user.password)
        if(!isPasswordValid){
            return res.status(400).json({message:'Invalid password'})
        }
        const token=sign({email:user.email,role:user.role},process.env.SECRET_KEY)
        res.cookie('token',token,{httpOnly:true})
        return res.status(200).json({message:'Login successful'})
    }
    catch(err){
        console.log("Login error:", err.message)
        next(err)
    }
})

//route for logout
authApp.post('/logout',async(req,res,next)=>{
    try{
        res.clearCookie('token')
        return res.status(200).json({message:'Logout successful'})
    }
    catch(err){
        console.log("Logout error:", err.message)
        next(err)
    }
})

export default authApp;