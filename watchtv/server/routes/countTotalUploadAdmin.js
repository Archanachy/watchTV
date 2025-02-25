const express = require('express');
const  { countTotalUpload }=require('../models/profileModel');
const { authenticateToken,verifyAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/totalUpload/:userId', authenticateToken, verifyAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;// Extract userId from URL params
      const totalUpload = await countTotalUpload(userId);
      res.status(200).json({ totalUpload });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch total upload for the user' });
    }
  });
  
  module.exports = router;