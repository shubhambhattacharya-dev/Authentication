import {User} from '../models/user.model.js';
export const signup=async(req,res)=>{
    const {email,password,name}=req.body; 
    try {
        if(!email || !password || !name){
            return res.status(400).json({
                error:"All fields are required"
            })
        }

        const userExists=await User.findOne({

        })
       
    } catch (error) {
        
    }
}

export const login=async(req,res)=>{
    return res.json({
        message:"login route"
    })
}

export const logout=async(req,res)=>{
    return res.json({
        message:"logout route"
    })
}