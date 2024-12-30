const express=require('express');       
const { createUser }=require('../models/UserModel');
const bcrypt=require('bcrypt');

const router=express.Router();

router.post('/register',async(req,res)=>{
    try{
        const {username,phone_number,password}=req.body;
        const hashedpassword=await bcrypt.hash(password,10);
        const result=await createUser(username,phone_number,hashedpassword);
        res.status(201).json({message: 'User created successfully',userId: result.rows[0].id});
    }catch(err){
        console.error(err.message);
        res.status(500).json({message: 'Server Error'});
    }
});

module.exports=router;

