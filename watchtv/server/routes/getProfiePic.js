const express=require('express');
const { getProfilePic }=require('../models/profileModel');
const { authenticateToken } = require('../middleware/auth');

const router=express.Router();

router.get('/profile_Pic',authenticateToken,async(req,res)=>{
    try {
        const userId=req.user.userId;
        const profilePicture=await getProfilePic(userId);
    
        if(!profilePicture){
        return res.status(404).json({message:'No profile picture uploaded!'}); 
        }
    
        res.status(200).json({profilePicture});
    } catch (error) {
        res.status(500).json({message:'Failed to fetch profile picture'});
    }
});

module.exports=router;