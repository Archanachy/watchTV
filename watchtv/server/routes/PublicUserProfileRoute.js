const express = require('express');
const { getProfileById } = require('../models/profileModel');
const { getRatedContent } = require('../models/rating');
const { countTotalUpload } = require('../models/profileModel');
const { getContentByUser } = require('../models/profileModel');
const router = express.Router();


// Get user profile
router.get('/user-profile/:userId', async (req, res) => {
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

// Get user's content
router.get('/post/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const content = await getContentByUser(userId); // Make sure this function exists in your models
      
      if (!content || content.length === 0) {
        return res.status(200).json({ content: [] }); // Return empty array instead of 404
      }
  
      res.status(200).json({ content });
    } catch (error) {
      console.error('Error fetching user content:', error.message);
      res.status(500).json({ message: 'Failed to fetch user content' });
    }
  });

// Get content rated by user
router.get('/content-rated/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const contentRated = await getRatedContent(userId);
    const totalRated = contentRated.length;
    res.status(200).json({ contentRated, totalRated });
  } catch (error) {
    console.error('Error fetching rated content:', error.message);
    res.status(500).json({ message: 'Could not fetch rated content' });
  }
});

// Get total uploads by user
router.get('/totalUpload/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const totalUpload = await countTotalUpload(userId);
    res.status(200).json({ totalUpload });
  } catch (error) {
    console.error('Error fetching total uploads:', error.message);
    res.status(500).json({ message: 'Failed to fetch total upload' });
  }
});

module.exports = router;