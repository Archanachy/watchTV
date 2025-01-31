const express = require('express');
const  {countTotalUpload}=require('../models/profileModel');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/totalUpload', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the authenticated token
    const totalUpload = await countTotalUpload(userId);
    
    res.status(200).json({ totalUpload });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total upload' });
  }
});

module.exports = router;