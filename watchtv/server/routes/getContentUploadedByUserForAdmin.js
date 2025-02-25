const express = require('express');
const { getContentByUser } = require('../models/profileModel');
const { authenticateToken,verifyAdmin} = require('../middleware/auth');

const router=express.Router();

router.get('/admin/post/:userId',authenticateToken,verifyAdmin,async(req,res)=>{
    try{
        const userId=req.params.userId;
        const content=await getContentByUser(userId);
        if(!content || content.length===0){
            return res.status(404).json({message:'No content uploaded!'});
        }
        res.status(200).json({content});
    }catch(error){
        res.status(500).json({message:'Failed to fetch content'});
    }
});

module.exports=router;

