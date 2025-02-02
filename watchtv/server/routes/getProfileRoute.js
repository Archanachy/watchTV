const express = require('express');
const  {getProfileById, countTotalUpload}=require('../models/profileModel');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the authenticated token
    const profile = await getProfileById(userId);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;