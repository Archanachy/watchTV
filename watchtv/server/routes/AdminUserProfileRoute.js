const express = require('express');
const { authenticateToken,verifyAdmin } = require('../middleware/auth');
const {  getRatedContent } = require('../models/rating');
const { getProfileById,getContentByUser,countTotalUpload } = require('../models/profileModel');
const router = express.Router();

router.get('/admin/content-rated/:userId', authenticateToken,verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const contentRated = await  getRatedContent(userId);
        const totalRated = contentRated.length;
        res.status(200).json({ contentRated, totalRated });
    } catch (error) {
        console.error('Error fetching rated content:', error.message);
        res.status(500).json({ message: 'Could not fetch rated content' });
    }
});

router.get('/admin/totalUpload/:userId', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;// Extract userId from URL params
      const totalUpload = await countTotalUpload(userId);
      res.status(200).json({ totalUpload });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch total upload for the user' });
    }
  });

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
  
router.get('/admin/user-profile/:userId', authenticateToken,verifyAdmin, async (req, res) => {
    try {
      const userId = req.params.userId;
      const profile = await getProfileById(userId);
  
      if (!profile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
  
      res.status(200).json({ profile });
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
});

module.exports = router;



