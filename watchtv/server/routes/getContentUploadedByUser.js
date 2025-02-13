const express=require('express');
const { getContentByUser }=require('../models/profileModel');
const { authenticateToken } = require('../middleware/auth');

const router=express.Router();

router.get('/post',authenticateToken,async(req,res)=>{
  try {
    const userId=req.user.userId;
    const content=await getContentByUser(userId);

    if(!content){
      return res.status(404).json({message:'No content uploaded!'}); 
    }

    res.status(200).json({content});
  } catch (error) {
    res.status(500).json({message:'Failed to fetch content'});
  }
}); 

module.exports=router;    